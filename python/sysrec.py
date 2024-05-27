import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import sys

# -------------------------------------





def sanitizeString(value):
    value = value.replace(" ", "");
    value = value.split("-")[-1]
    return value

def load_user_data(filepath):
    ## Load exel data fi object ismo data type ta3o DataFrame.
    data = pd.read_excel(filepath, header=0)  # Use the first row as the header
    # Reset user IDs to start from 1
    data['user_id'] = range(1, len(data) + 1)

    data['wilaya'] = data['wilaya'].apply(sanitizeString)

    
    # Check if 'past_interaction' column exists in the DataFrame
    if 'id' not in data.columns:
        data['id'] = "missing"
    data['id'] = data['id'].astype(str)  # Add 'past_interaction' column filled with 'missing' values if not present
    return data
# -----------------------------------------------------




def preprocess_data(data):
    # Ensure categorical data is treated as strings
    categorical_columns = ['wilaya', 'commune']  # List all your categorical columns
    for column in categorical_columns:
        data[column] = data[column].astype(str)  # Convert categorical columns to string
        
    # Etape Pre-Traitement { 7otha fi memior }
    # Fill missing values
    data.fillna({
        'age': data['age'].median(),   # Use median for numerical columns
        'wilaya': 'missing',           # Use 'missing' or another placeholder for categorical columns
        'commune': 'missing'
    }, inplace=True)
    return data
# --------------------------------------------




def find_similar_users(data, new_user, threshold=0.6):

    ##### Hadi tani Pre-Traitement { Normalization } ############################################################################
    numeric_features = ['age']
    categorical_features = ['wilaya', 'commune']

    # Define column transformations
    ct = ColumnTransformer([
        ('num', Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ]), numeric_features),
        ('cat', Pipeline([
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ]), categorical_features)
    ], remainder='passthrough')
    ###############################################################################################################################

    # Preprocess the new user data
    new_user_df = pd.DataFrame([new_user])
    new_user_df['wilaya'] = new_user_df['wilaya'].apply(sanitizeString)
    # new_user_df['id'] = new_user_df['id'].astype(str)
    # new_user_df.drop(columns=['id'], inplace=True)
    new_user_df = preprocess_data(new_user_df)

    # Preprocess the existing data
    data = preprocess_data(data)

    # Reset indices, adds index from 0,..,n in the DataFrame
    data.reset_index(drop=True, inplace=True)
    
    # Save 'past_interaction' column if exists
    # Isolate the Target Column.``
    target_column = None
    if 'id' in data.columns:
        target_column = data['id']
        data.drop(columns=['id'], inplace=True)

    # Preprocess combined data
    combined_data = pd.concat([data.drop('user_id', axis=1), new_user_df], ignore_index=True)

    ## Transfromed DataSet, applied Preprossing.
    feature_matrix = ct.fit_transform(combined_data)

    # Compute cosine similarities between the new user and existing users
    similarities = cosine_similarity(feature_matrix[:-1], feature_matrix[-1].reshape(1, -1)).flatten()
    
    

    # Find indices of users with similarity above the threshold
    similar_users_indices = np.where(similarities >= threshold)[0]

    if len(similar_users_indices) > 0:
        # Sort similar users based on similarity score (highest to lowest)
        sorted_indices = np.argsort(-similarities[similar_users_indices])
        similar_users_indices_sorted = similar_users_indices[sorted_indices]

        # Get similar users data and similarity scores
        similar_users = data.iloc[similar_users_indices_sorted]
       # similarity_scores = similarities[similar_users_indices_sorted]

        most_similar_user = similar_users.iloc[0]
        
        # Filter past interactions for similar users
        target_column = target_column.iloc[similar_users_indices_sorted]

    else:
        similar_users = pd.DataFrame(columns=data.columns)  # Empty DataFrame
        most_similar_user = None
        target_column = None

    return similar_users, most_similar_user, target_column
# -----------------------------------------------------




def main():
    filepath = 'C:\\Users\\dell\\Downloads\\crenodataset.xlsx'
    try:
        data = load_user_data(filepath)
        Age = int(sys.argv[1])
        Wilaya = sys.argv[2]
        Commune = sys.argv[3]
        Id = sys.argv[4]

        new_user = {
        'age': Age,
        'wilaya': Wilaya,
        'commune': Commune,
        }

        new_user_id = data['user_id'].max() + 1

        printable_new_user = {
        'user_id': new_user_id,
        'age': Age,
        'wilaya': Wilaya,
        'commune': Commune,
        'id':Id
        }
        

        
        initial_recommendations = []

        similar_users, most_similar_user, target_column = find_similar_users(data, new_user)
        recommended_ids = []
        if target_column is not None:
         recommended_ids += target_column.tolist()

        print(recommended_ids) 

        data = load_user_data(filepath)
        if ((data['id'] == Id)).any():
            return
        else :   
            new_user_df = pd.DataFrame([printable_new_user])
            new_user_df = preprocess_data(new_user_df)
            data = pd.concat([data, new_user_df], ignore_index=True)
            data.to_excel(filepath, index=False)


        

    except FileNotFoundError:
        print(f"The file was not found at {filepath}")
    except Exception as e:
        print(f"An error occurred: {e}")
    # data = preprocess_data(data)  # Preprocess to ensure consistent data types and handle missing values
        
    

main()