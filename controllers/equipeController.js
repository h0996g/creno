const Equipe = require('../models/equipe');
const Tournoi = require('../models/tournoi');
const { ObjectId } = require('mongoose').Types;

const { nanoid } = require('nanoid');

//----------------------------

exports.createEquipe = async (req, res) => {
    try {
        const id = req.user._id;
        const { nom, numero_joueurs, joueurs, wilaya, commune, capitaine_id } = req.body;

        // Check if a team with the same name already exists
        const existingEquipe = await Equipe.findOne({ nom });
        if (existingEquipe) {
            return res.status(409).json({ message: 'A team with this name already exists.' });
        }

        // If the team name does not exist, create the new team
        const createEquipe = new Equipe({ nom, numero_joueurs, joueurs, wilaya, commune, capitaine_id: id, joueurs: [id] });
        await createEquipe.save();
        res.status(201).json({ data: createEquipe });
    } catch (e) {
        res.status(500).json(e);
    }
}

//----------------------------
exports.modifierEquipe = async (req, res) => {
    try {
        const id_Equipe = req.params.id;
        const { nom, numero_joueurs, joueurs, wilaya, commune, capitaine_id } = req.body;
        // if (capitaine_id !== req.user._id.toString()) {
        //     return res.status(403).json({ error: 'You are not authorized to modify this equipe.' });
        // }
        const equipe = await Equipe.findByIdAndUpdate(id_Equipe, { nom, numero_joueurs, joueurs, wilaya, commune, capitaine_id }, { new: true });

        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        } else {
            res.json(equipe);
        }
    } catch (e) {
        res.json(e);
    }
}


exports.updateJoueursEquipe = async (req, res) => {
    try {
        const id_Equipe = req.params.id;
        const { joueurs, attente_joueurs } = req.body;
        const equipe = await Equipe.findByIdAndUpdate(id_Equipe, { joueurs, attente_joueurs }, { new: true });
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        } else {
            res.json(equipe);
        }
    } catch (e) {
        res.json(e);
    }
}
//----------------------------
exports.supprimerEquipe = async (req, res) => {
    try {
        const id = req.params.id;

        const equipe = await Equipe.deleteOne({ _id: id });
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        }
        res.status(204).json({ message: 'Equipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//----------------------------
exports.findEquipeById = async (req, res) => {
    try {
        const id_Equipe = req.params.id;
        const equipe = await Equipe.findById(id_Equipe);
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe not found' });
        }
        res.json(equipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//-------------------------------------

exports.searchMyEquipes = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id; // Extract userId from request parameters
        const nom = req.query.nom;
        const vertial = req.query.vertial;
        const regex = new RegExp(nom, 'i');
        const limit = parseInt(req.query.limit) || 10; // Default limit to 4 documents, corrected the default value mentioned in comment
        const query = { capitaine_id: userId, vertial: false, nom: { $regex: regex } }; // Search for teams where userId is the capitaine_id
        if (vertial === 'true') {
            query.vertial = true;
        }
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const equipes = await Equipe.find(query)
            .populate({
                path: 'capitaine_id',
                select: 'username nom telephone' // Selecting name and phone from capitaine
            })
            .populate({
                path: 'joueurs',
                select: 'username nom telephone photo' // Selecting name and phone from joueurs
            })
            .populate({
                path: 'attente_joueurs',
                select: 'username nom telephone photo', // Selecting name and phone from joueurs in waiting

            })
            .populate({
                path: 'attente_joueurs_demande',
                select: 'username nom telephone photo' // Selecting name and phone from joueurs in waiting
                , populate: {
                    path: 'joueur',
                    select: 'username nom telephone photo'
                }
            })
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = equipes.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchEquipes = async (req, res) => {
    try {

        // const userId = req.user._id; // Extract userId from request parameters
        const nom = req.query.nom;
        const regex = new RegExp(nom, 'i');
        const limit = parseInt(req.query.limit) || 10; // Default limit to 4 documents, corrected the default value mentioned in comment
        const query = { nom: { $regex: regex } }; // Search for teams where userId is the capitaine_id

        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const equipes = await Equipe.find(query)
            .populate({
                path: 'capitaine_id',
                select: 'username nom telephone' // Selecting name and phone from capitaine
            })
            .populate({
                path: 'joueurs',
                select: 'username nom telephone photo' // Selecting name and phone from joueurs
            })
            .populate({
                path: 'attente_joueurs',
                select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
            })
            .populate({
                path: 'attente_joueurs_demande',
                select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
                , populate: {
                    path: 'joueur',
                    select: 'username nom telephone'
                }
            })
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = equipes.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};


//---------------------------------------------------
exports.getEquipesImIn = async (req, res) => {
    try {
        console.log(req.user); // Debug: Print user info to console
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id; // Extract userId from request parameters
        const vertial = req.query.vertial;

        const limit = parseInt(req.query.limit) || 10; // Set the default limit
        const query = { joueurs: { $in: [userId] }, vertial: false }; // Search for teams where userId is in the joueurs array
        if (vertial === 'true') {
            query.vertial = true;
        }
        // Apply cursor if present
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const equipes = await Equipe.find(query)
            .populate({
                path: 'capitaine_id',
                select: 'username nom telephone photo' // Selecting name and phone from capitaine
            })
            .populate({
                path: 'joueurs',
                select: 'username nom telephone photo' // Selecting name and phone from joueurs
            })
            .populate({
                path: 'attente_joueurs',
                select: 'username nom telephone photo' // Selecting name and phone from joueurs in waiting
            })
            .populate({
                path: 'attente_joueurs_demande',
                select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
                , populate: {
                    path: 'joueur',
                    select: 'username nom telephone'
                }
            })
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = equipes.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.findAllEquipes = async (req, res) => {
    try {
        const idList = req.body.idList || [];
        const limit = parseInt(req.query.limit) || 50;
        const vertial = req.query.vertial;

        const query = { vertial: false };
        if (vertial === 'true') {
            query.vertial = true;
        }
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the equipes whose capitaine_id is present in idList
        const priorityEquipes = await Equipe.find({
            ...query,
            capitaine_id: { $in: idList.map(id => new ObjectId(id)) }
        })
            .populate({
                path: 'capitaine_id',
                select: 'username nom telephone photo'
            })
            .populate({
                path: 'joueurs',
                select: 'username nom telephone photo'
            })
            .populate({
                path: 'attente_joueurs',
                select: 'username nom telephone photo'
            })
            .populate({
                path: 'attente_joueurs_demande',
                select: 'username nom telephone',
                populate: {
                    path: 'joueur',
                    select: 'username nom telephone'
                }
            })
            .sort({ _id: -1 })
            .limit(limit);

        // Calculate the remaining limit
        const remainingLimit = limit - priorityEquipes.length;

        // Fetch the remaining equipes if the limit is not reached
        let remainingEquipes = [];
        // If there's still limit remaining, fetch the remaining equipes
        if (remainingLimit > 0) {
            remainingEquipes = await Equipe.find({
                ...query,
                capitaine_id: { $nin: idList.map(id => new ObjectId(id)) }
            })
                .populate({
                    path: 'capitaine_id',
                    select: 'username nom telephone photo'
                })
                .populate({
                    path: 'joueurs',
                    select: 'username nom telephone photo'
                })
                .populate({
                    path: 'attente_joueurs',
                    select: 'username nom telephone photo'
                })
                .populate({
                    path: 'attente_joueurs_demande',
                    select: 'username nom telephone',
                    populate: {
                        path: 'joueur',
                        select: 'username nom telephone'
                    }
                })
                .sort({ _id: -1 })
                .limit(remainingLimit);
        }

        // Combine the priority equipes and remaining equipes
        const equipes = [...priorityEquipes, ...remainingEquipes];

        const moreDataAvailable = equipes.length === limit;
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//--------------------- invitation des equipes---------------------

exports.getEquipesInvitedMe = async (req, res) => {
    try {
        console.log(req.user); // Debug: Print user info to console
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id; // Extract userId from request parameters

        const limit = parseInt(req.query.limit) || 10; // Set the default limit
        const query = { attente_joueurs: { $in: [userId] } }; // Search for teams where userId is in the joueurs array

        // Apply cursor if present
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, limited and sorted
        const equipes = await Equipe.find(query)
            .populate({
                path: 'capitaine_id',
                select: 'username nom telephone' // Selecting name and phone from capitaine
            })
            .populate({
                path: 'joueurs',
                select: 'username nom telephone' // Selecting name and phone from joueurs
            })
            .populate({
                path: 'attente_joueurs',
                select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
            })
            .populate({
                path: 'attente_joueurs_demande',
                select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
                , populate: {
                    path: 'joueur',
                    select: 'username nom telephone'
                }
            })
            .limit(limit)
            .sort({ _id: -1 });

        // Check if there's more data available
        const moreDataAvailable = equipes.length === limit;

        // Determine the next cursor
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//------------------les demandes des joueurs -------------------------

// exports.getEquipesDemandedMe = async (req, res) => {
//     try {

//         const userId = req.user._id; // Extract userId from request parameters

//         const limit = parseInt(req.query.limit) || 10; // Set the default limit
//         const query = { attente_joueurs_demande: { $in: [userId] } }; // Search for teams where userId is in the joueurs array

//         // Apply cursor if present
//         if (req.query.cursor) {
//             query._id = { $lt: new ObjectId(req.query.cursor) };
//         }

//         // Fetch the documents from the database, limited and sorted
//         const equipes = await Equipe.find(query)
//             .populate({
//                 path: 'capitaine_id',
//                 select: 'username nom telephone' // Selecting name and phone from capitaine
//             })
//             .populate({
//                 path: 'joueurs',
//                 select: 'username nom telephone' // Selecting name and phone from joueurs
//             })
//             .populate({
//                 path: 'attente_joueurs',
//                 select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
//             })
//             .populate({
//                 path: 'attente_joueurs_demande',
//                 select: 'username nom telephone' // Selecting name and phone from joueurs in waiting
//             })
//             .limit(limit)
//             .sort({ _id: -1 });

//         // Check if there's more data available
//         const moreDataAvailable = equipes.length === limit;

//         // Determine the next cursor
//         const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : '';

//         res.json({
//             data: equipes,
//             moreDataAvailable,
//             nextCursor,
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


//----------------------------
exports.filterEquipes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter

        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, sort by _id
        const equipes = await Equipe.find(filter).sort({ _id: -1 }).limit(limit);

        // Determine if there's more data to fetch
        const moreDataAvailable = equipes.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? equipes[equipes.length - 1]._id : null;

        res.json({
            data: equipes,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------

exports.rejoindreTournoi = async (req, res) => {
    try {
        const { equipeId, tournoiId } = req.params;

        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        const tournoi = await Tournoi.findById(tournoiId);
        if (!tournoi) {
            return res.status(404).json({ message: 'tournoi not found' });
        }
        await Equipe.updateOne({ _id: equipeId }, { $push: { tournois: tournoiId } });
        await Tournoi.updateOne({ _id: tournoiId }, { $push: { equipes: equipeId } });
        res.status(200).json({ message: 'Equipe joined tournoi successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.quitterTournoi = async (req, res) => {
    try {
        const { equipeId, tournoiId } = req.params;

        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        const tournoi = await Tournoi.findById(tournoiId);
        if (!tournoi) {
            return res.status(404).json({ message: 'tournoi not found' });
        }
        await Equipe.updateOne({ _id: equipeId }, { $pull: { tournois: tournoiId } });
        await Tournoi.updateOne({ _id: tournoiId }, { $pull: { equipes: equipeId } });
        res.status(200).json({ message: 'Equipe quitted the tournoi successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createEquipeCopyVertial = async (req, res) => {
    try {
        const id = req.user._id;
        const { nom, numero_joueurs, joueurs, wilaya, commune, attente_joueurs } = req.body;

        // Check if a team with the same name already exists
        const existingEquipe = await Equipe.findOne({ nom });
        if (!existingEquipe) {
            return res.status(409).json({ message: 'A team with this name not exists.' });
        }

        const nameVertial = nom + "/" + nanoid(5);
        console.log(nameVertial);
        const createEquipe = new Equipe({ nom: nameVertial, numero_joueurs, joueurs, wilaya, commune, capitaine_id: id, vertial: true, attente_joueurs });
        await createEquipe.save();
        res.status(201).json(createEquipe);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);

    }
}