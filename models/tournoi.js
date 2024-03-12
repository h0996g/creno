const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var results = new Object();

const tournoiSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    
    s_date: {
        type: Date,
        required: true

    },
    e_date: {
        type: Date,
        required: true

    } ,
    type: {
        type: String,
        required: true

    }, 
    numero_equipe: {
        type: Number,
        required: true

    } ,
    frais_inscription: {
        type: Number,
        required: true

    } ,
    lieu: {
        type: String,
        required: true

    },




    admin_id: { type: ObjectId, ref: 'Admin' },
   


   
      equipes: [{
        
            type: ObjectId, required: false,
            ref: "Equipe"
        
    }],
}, { timestamps: true })


tournoiSchema.post('save', async function (doc, next) {
    try {
        const admin = await mongoose.model('Admin').findById(doc.admin_id);
        admin.tournois.push(doc._id);

        await admin.save();
    } catch (error) {
        console.error('Error updating admin with new tournoi:', error);
    }
}
);


tournoiSchema.pre('deleteOne',  async function(next) {
    try {
        
        const tournoiId = this.getQuery()._id;
        
        
        const admin = await mongoose.model('Admin').findOne({ tournois: tournoiId });
        
        if (admin) {
            admin.tournois.pull(tournoiId);
            await admin.save();
        }

        
        const equipes = await mongoose.model('Equipe').find({ tournois: tournoiId });

        for (const equipe of equipes) {
            equipe.tournois.pull(tournoiId);
            await equipe.save();
        }
    } catch (error) {
        console.log(error);
    }
});




const Tournoi = mongoose.model('Tournoi', tournoiSchema)
module.exports = Tournoi   