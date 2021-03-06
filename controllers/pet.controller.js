const db = require("../models");
const sequelize = require("sequelize");
const Pet = db.pet;
const Contact = db.petContact;
const Account = db.account;
const Event = db.petEvent;
const Weight = db.petWeight;
const Record = db.petRecord;

// Create and Save a new Pet
exports.create = (req, res) => {
    // Validate request
    if (!req.body.SpeciesId || !req.body.PetName || !req.body.PetGender) {
        res.status(400).send({
            message: "Error. Essential fields are empty."
        });
        return;
    }
    
    const defaultDog = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/dog_default.svg?alt=media&token=893cb1b6-cf61-4094-96a1-0faccbfa1d15";
    const defaultCat = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/cat_default.svg?alt=media&token=e59ff474-79c9-49fd-92a5-a51586a9bb90";
    const defaultRabbit = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/rabbit_default.svg?alt=media&token=c142a260-d73e-4992-b887-4fdc5c1f83ee";
    const defaultFerret = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/ferret_default.svg?alt=media&token=d3b00118-fb76-4c97-b6a9-1bf34ddac933";
    const defaultHamster = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/hamster_default.svg?alt=media&token=854870ec-f9d5-49b1-9bef-63d4b08526a8";
    const defaultMouse = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/mouse_default.svg?alt=media&token=a664877e-8cf1-4a95-bd56-03bdc944c047";
    const defaultTurtle = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/turtle_default.svg?alt=media&token=f0badb0d-c458-4155-ae06-ea35520d5fad";
    const defaultSnake = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/snake_default.svg?alt=media&token=69cec39a-96bb-47cb-8333-bef97f5e0697";
    const defaultHorse = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/horse_default.svg?alt=media&token=93b55711-d124-41ab-b38e-b304e6b2a821";
    const defaultPaws = "https://firebasestorage.googleapis.com/v0/b/petrecs-file-system.appspot.com/o/pawprints_default.svg?alt=media&token=25dc5add-37f0-462d-b357-c92fb131acaa";
    var defaultProfile = "";
    
    switch (req.body.SpeciesId)
    {
        case '1': defaultProfile = defaultDog;
                break;
        case '2': defaultProfile = defaultCat;
                break;
        case '3': defaultProfile = defaultRabbit;
                break;
        case '4': defaultProfile = defaultFerret;
                break;
        case '5': 
        case '6':
        case '7': 
        case '10': defaultProfile = defaultHamster;
                break;
        case '8': 
        case '9': defaultProfile = defaultMouse;
                break;
        case '15':
        case '16': defaultProfile = defaultTurtle;
                break;
        case '18':defaultProfile = defaultSnake;
                break;
        case '40':
        case '41': defaultProfile = defaultHorse;
                break; 
        default: defaultProfile = defaultPaws;
    }

    // Create Pet
    const pet = {
        SpeciesId: req.body.SpeciesId,
        BreedId: req.body.BreedId,
        PetName: req.body.PetName,
        PetGender: req.body.PetGender,
        PetAgeYear: req.body.PetAgeYear,
        PetAgeMonth: req.body.PetAgeMonth,
        PetAgeDay: req.body.PetAgeDay,
        AllergyNotes: req.body.AllergyNotes,
        FoodNotes: req.body.FoodNotes,
        CareNotes: req.body.CareNotes,
        ProfileUrl: defaultProfile
    };

    // Save Pet to database
    Pet.create(pet)
        .then(data => {
            // Save corresponding Pet Contact
            Contact.create({
                AccountId: req.session.user.AccountId,
                PetId: data.PetId,
                Owner: 1
            }).then(data => {
                //console.log(data)
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the pet contact"
                });
            })
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the pet"
            });
        })
};

// Retrieve all *Owned* Pets from the database belonging to specific user
exports.findAll = (req, res) => {
    if(!req.session.user) {
        res.status(401).send("You are not logged in.");
        return;
    }

    let contactArr = [];

    Contact.findAll({
        where: { AccountId: req.session.user.AccountId, Owner: 1}
    })
        .then(data => {
            for(let i = 0; i < data.length; i++) {
                contactArr.push(data[i].PetId);
            }
            Pet.findAll( {
                where: { PetId: contactArr },
                attributes: ['PetId', 'PetName', 'ProfileUrl']
            })
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving owned Pets."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Pet Contacts."
            });
        });
};

// Retrieve all Pets from the database *shared* to a specific user
exports.findShared = (req, res) => {
    if(!req.session.user) {
        res.status(401).send("You are not logged in.");
        return;
    }

    let contactArr = [];

    Contact.findAll({
        where: { AccountId: req.session.user.AccountId, Owner: 0}
    })
        .then(data => {
            for(let i = 0; i < data.length; i++) {
                contactArr.push(data[i].PetId);
            }
            Pet.findAll( {
                where: { PetId: contactArr },
                attributes: ['PetId', 'PetName', 'ProfileUrl']
            })
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving shared Pets."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Pet Contacts."
            });
        });
};

// Find a single Pet with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    // Validate that user has access to pet
    Contact.findOne({
        where: {PetId: req.params.id, AccountId: req.session.user.AccountId}
    })
        .then(data => {
            if (data === null) {
                res.status(401).send("This user does not have access to this pet, or pet does not exist");
            } else {
                // Find and return pet by id
                return Pet.findByPk(id)
                    .then(data => {
                        if (data === null) {
                            res.status(400).send("Pet not found");
                        } else {
                            res.send(data);
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Error when retrieving Pet with id=" + id
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send( {
                message:
                    err.message || "Some error occurred while validating if user has access to pet"
            });
        });


};

// Update a single Pet identified by the request id
exports.update = (req, res) => {
    const id = req.params.id;
    const body = req.body;

    // Verify that user is owner of pet they are trying to update
    Contact.findOne({
        where: {PetId: req.params.id, AccountId: req.session.user.AccountId}
    })
        .then(data => {
            if (data === null || !data.Owner) {
                res.status(401).send("This user does not own this pet, or pet does not exist");
            } else {
                // Update Pet
                return Pet.update(body, {
                    where: {PetId: id}
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Pet was updated successfully."
                            });
                        } else {
                            //console.log(req.body)
                            res.send({
                                message: `Cannot update Pet with id=${id}. Maybe Pet was not found or request body was empty.`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Error updating Pet with id=" + id
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send( {
                message:
                    err.message || "Some error occurred while validating if user is owner of pet"
            });
        });
};

// Delete a single Pet with the specified id
exports.delete = (req, res) => {
    const id = req.params.id;

    // Verify that user is owner of pet they are trying to destroy
    Contact.findOne({
        where: {PetId: req.params.id, AccountId: req.session.user.AccountId}
    })
        .then(data => {
            if (data === null || !data.Owner) {
                res.status(401).send("This user does not own this pet, or pet does not exist");
            } else {
                // Destroy associated Pet Contacts
                return Contact.destroy({
                    where: {PetId: req.params.id}
                })
                    .then(data => {
                        // Destroy associated Pet Events
                        return Event.destroy({
                            where: {PetId: req.params.id}
                        })
                            .then(data => {
                                // Destroy associated Pet Weights
                                return Weight.destroy({
                                    where: {PetId: req.params.id}
                                })
                                    .then(data => {
                                        // Destroy associated Pet Records
                                        return Record.destroy({
                                            where: {PetId: req.params.id}
                                        })
                                            .then(data => {
                                                // Destroy pet
                                                return Pet.destroy({
                                                    where: {PetId: id}
                                                })
                                                    .then(num => {
                                                        if (num === 1) {
                                                            res.status(200).send({
                                                                message: "Pet was deleted successfully!"
                                                            });
                                                        } else {
                                                            res.status(500).send({
                                                                message: `Cannot delete Pet with id=${id}. Maybe Pet was not found.`
                                                            });
                                                        }
                                                    })
                                                    .catch(err => {
                                                        res.status(500).send({
                                                            message:
                                                                err.message || "Could not delete Pet with id=" + id
                                                        });
                                                    });
                                            })
                                            .catch(err => {
                                                res.status(500).send( {
                                                    message:
                                                        err.message || "Some error occurred while destroying associated records"
                                                });
                                            })
                                    })
                                    .catch(err => {
                                        res.status(500).send( {
                                            message:
                                                err.message || "Some error occurred while destroying associated weights"
                                        });
                                    })
                            })
                            .catch(err => {
                                res.status(500).send( {
                                    message:
                                        err.message || "Some error occurred while destroying associated events"
                                });
                            });
                    })
                    .catch(err => {
                        res.status(500).send( {
                            message:
                                err.message || "Some error occurred while destroying associated contacts"
                        });
                    })
            }
        })
        .catch(err => {
            res.status(500).send( {
                message:
                    err.message || "Some error occurred while validating if user is owner of pet"
            });
        });
};

// Share a single Pet with the specified id to a specified account with email
exports.share = (req, res, next) => {
    const id = req.params.id;
    const email = req.body.Email;

    // Validate that user is owner of pet
    Contact.findOne({
        where: {PetId: req.params.id, AccountId: req.session.user.AccountId, Owner: 1}
    })
        .then(data => {
            if (data === null) {
                res.status(401).send("This user is not owner of this pet, or pet does not exist");
            } else {
                // Check if account exists
                return Account.findOne({
                    where: {Email: email}
                })
                    .then(data => {
                        if (data === null) {
                            res.status(400).send("Account does not exist with that email");
                        } else {
                            let acct = data.AccountId;
                            // Check if pet is already being shared with this account
                            return Contact.findOne({
                                where: {AccountId: acct, PetId: id}
                            })
                                .then(data => {
                                    if (data !== null) {
                                        res.status(400).send("Account already has access to this pet")
                                    } else {
                                        // Share pet with account
                                        return Contact.create({
                                            AccountId: acct, PetId: id
                                        })
                                            .then(data => {
                                                res.status(200).send(`Pet ${id} has been shared with account ${acct}!`);
                                            })
                                            .catch(err => {
                                                res.status(500).send(err.message || `Could not share Pet ${id} with account ${acct}`);
                                            })
                                    }
                                })
                                .catch(err => {
                                    res.status(500).send(err.message || `Error when checking if pet ${id} is already shared with account ${acct}`);
                                })
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Error when checking account existence with email=" + email
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send( {
                message:
                    err.message || "Some error occurred while validating if user is owner of pet"
            });
        });

}
// Check if current logged-in user is owner of pet by PetId
exports.validate = (req, res, next) => {
    // Validate that user is owner of pet
    Contact.findOne({
        where: {PetId: req.params.id, AccountId: req.session.user.AccountId, Owner: 1}
    })
        .then(data => {
            if (data === null) {
                res.status(401).send("This user is not owner of this pet, or pet does not exist");
            } else {
                res.status(200).send("This user is a valid owner of pet")
            }
        })
        .catch(err => {
            res.status(500).send("Error retrieving pet contacts for account id=" + req.params.id)
        });
}

exports.findSharedAccounts = (req, res) => {
    const id = req.params.id;
    // Validate that user is owner of pet
    Contact.findOne({
        where: {PetId: id, AccountId: req.session.user.AccountId, Owner: 1}
    })
        .then(data => {
            if (data === null) {
                // This user is not owner of this pet, or pet does not exist
                res.send([]);
            } else {
                // Get list of accounts that have access to this pet that AREN'T the current user
                Contact.findAll({
                    where: {PetId: req.params.id, AccountId: {[sequelize.Op.not]: req.session.user.AccountId}},
                    attributes: ["AccountId"]
                })
                    .then(data => {
                        return Account.findAll({
                            where: {AccountId: data.map(account => account.AccountId)},
                            attributes: ['AccountId', 'FirstName', 'LastName', 'Email']
                        })
                            .then(accounts => {
                                res.send(accounts);
                            })
                            .catch(err => {
                                res.status(500).send("error retrieving list of accounts");
                            })
                    })
                    .catch(err => {
                        res.status(500).send("Error retrieving pet contacts that have access to pet id=" + id)
                    })
            }
        })
        .catch(err => {
            res.status(500).send("Error retrieving pet contacts for pet id=" + req.params.id)
        });
}

exports.deleteSharedAccount = (req, res) => {
    const petId = req.params.id;
    const accountId = req.params.acct;
    // Validate that user is owner of pet
    Contact.findOne({
        where: {PetId: petId, AccountId: req.session.user.AccountId, Owner: 1}
    })
        .then(data => {
            if (data === null) {
                res.status(401).send("This user is not owner of this pet, or pet does not exist");
            } else {
                // Remove account from share privileges
                Contact.destroy({
                    where: {PetId: petId, AccountId: accountId}
                })
                    .then(data => {
                        //console.log(data);
                        if (data === 0) {
                            res.status(401).send("This account already does not have share access to this pet, or the account does not exist");
                        } else {
                            res.status(200).send("Account share privileges have been revoked")
                        }

                    })
                    .catch(err => {
                        res.status(500).send("Error deleting pet contact where pet id="+petId+" and account id="+accountId);
                    })
            }
        })
        .catch(err => {
            res.status(500).send("Error retrieving pet contacts for pet id=" + req.params.id+" and account id="+req.params.acct)
        });
}

