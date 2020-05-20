const mongoose = require("mongoose");
const model = require("../models/events");
const constants = require("../../constants");

exports.testReturnEvent = (req, res, next) => {
  res.status(200).json("Going Good! Event is also fine");
};

exports.createSimpleEvent = (req, res, next) => {
  //the one who create event is alway admin and when person who will accept invitation they will be member of group okay

  var findquery = { eventName: req.body.eventName };
  model
    .find(findquery)
    .exec()
    .then((result) => {
      if (result == null || result.length <= 0) {
        var newEvent = new model({
          _id: new mongoose.Types.ObjectId(),
          eventName: req.body.eventName,
          userEmail: req.body.userEmail,
          details: req.body.details,
        });
        console.log(` print event object ${newEvent}`);
        newEvent.save((err, result) => {
          if (!err) {
            res.status(200).json({ status: true, result: result });
          } else {
            res.status(500).json({ message: err });
          }
        });
      } else {
        //409 conflict //422 cannt process it

        res.status(409).json({
          message: "Sorry  eventalready create by someone try different name ",
          status: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error while Find Query : error occured ${err}`,
        status: false,
      });
    });
};

exports.createComplexEvent = (req, res, next) => {
  //the one who create event is alway admin and when person who will accept invitation they will be member of group okay
  var rawinvitationemails = String(req.body.invitations).split(",");
  console.log(` list of string ${rawinvitationemails}`);
  var createinvitationObject = [];
  for (let index = 0; index < rawinvitationemails.length; index++) {
    const element = rawinvitationemails[index];
    createinvitationObject.push({
      userEmail: element,
      isRejected: false,
    });
  }

  var findquery = { eventName: req.body.eventName };
  model
    .find(findquery)
    .exec()
    .then((result) => {
      if (result == null || result.length <= 0) {
        //var rawinvitationemails = ['email','email2',...]

        var newEvent = new model({
          _id: new mongoose.Types.ObjectId(),
          eventName: req.body.eventName,
          userEmail: req.body.userEmail,
          details: req.body.details,
          members: [
            {
              userEmail: req.body.userEmail,
              isActive: true,
              isAdmin: true,
            },
          ],
          invited: createinvitationObject,
        });
        console.log(` print event object ${newEvent}`);
        newEvent.save((err, result) => {
          if (!err) {
            res.status(200).json({ status: true, result: result });
          } else {
            res.status(500).json({ message: err });
          }
        });
      } else {
        //409 conflict //422 cannt process it

        res.status(409).json({
          message: "Sorry  eventalready create by someone try different name ",
          status: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error while Find Query : error occured ${err}`,
        status: false,
      });
    });
};

exports.listAllEvents = (req, res, next) => {
  // will list all events in sorting vai name or vai date they where created .
  model.find({}, function (err, doc) {
    if (!err) {
      if (doc != null && doc.length > 0) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Data Found!" });
      }
    } else {
      res.status(500).json({ message: err });
    }
  });
};

exports.getEventbyName = (req, res, next) => {
    //db.stuff.find( { foo: /^bar$/i } );
    //for case insensitive just need to use above line
  const eventName = req.body.eventName;
  model.find({ eventName: eventName }, function (err, doc) {
    if (!err) {
      if (doc != null && doc.length > 0) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Data Found!" });
      }
    } else {
      res.status(500).json({ message: err });
    }
  });
};

exports.checkMyEventAndInvites = (req, res, next) => {
  // for the given email id
  //get all event name where person is member
  //get all eventname where person is invited
  const myemail = req.body.email;
  var filterQuery = {
    $or: [{ "members.userEmail": myemail }, { "invited.userEmail": myemail }],
  };
  model.find(filterQuery, function (err, doc) {
    if (!err) {
      if (doc != null && doc.length > 0) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Data Found!" });
      }
    } else {
      res.status(500).json({ message: err });
    }
  });
};

exports.updateEvent = (req, res, next) => {
  var eventName = req.body.eventName;
  var updateDictionaryList = req.body.updateDictionaryList;
  var paramfilterquery = { eventName: eventName };
  // var updateDictionaryList = [
  //   { key: "details", value: "details" }
  // ];
  const updateOps = {};
  for (const ops of updateDictionaryList) {
    updateOps[ops.key] = ops.value;
  }
  var filterQuery = paramfilterquery;
  var UpdateQuery = { $set: updateOps };
  model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
    if (!err) {
      res.status(200).json({
        message: `updated SuccessFully ${doc}`,
        status: true,
      });
    } else {
      res.status(500).json({ message: err });
      // return { message: `error occoured ${err}`, status: false };
    }
  });

  // update event description here vai event name.
};

exports.getSortEventByName = (req, res, next) => {
  // show event name
  //member of event
  // invites of event
  var mysort = { eventName: 1 };
  model
    .find({}, function (err, doc) {
      if (!err) {
        if (doc != null && doc.length > 0) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({ message: "No Data Found!" });
        }
      } else {
        res.status(500).json({ message: err });
      }
    })
    .sort(mysort);
};

exports.filterByDate = (req, res, next) => {
  // here will have search from a text in mongo db some what similar event will be searched for user here .
  //event created range of filter
  var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var mysort = { doc: 1 };
  //var filterquery = { doc: { $gte: '1987-10-19', $lte: '1987-10-26' } }
  var filterquery = { doc: { $gte: startdate, $lte: enddate } };
  //var filterquery = { doc: { $gte: new Date(new Date(startdate).setHours(00, 00, 00)), $lte: new Date(new Date(enddate).setHours(23, 59, 59)) } };
  model
    .find(filterquery, function (err, doc) {
      if (!err) {
        if (doc != null && doc.length > 0) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({ message: "No Data Found!" });
        }
      } else {
        res.status(500).json({ message: err });
      }
    })
    .sort(mysort);
};

exports.invitInEvent = (req, res, next) => {
  //the one who create event is alway admin and when person who will accept invitation they will be member of group okay
  //   Person.update({'items.id': 2}, {'$set': {
  //     'items.$.name': 'updated item2',
  //     'items.$.value': 'two updated'
  // }}, function(err) { ...
  //updating array object of event collections
  //to remove duplicate and to add multiple email in one go will fetch first data and then update and then set the invitation okay

  var eventName = req.body.eventName;
  var invitEmails = String(req.body.emails).split(",");
  //before sending a invit we can check if no already given a invitation or already in member list we can check this

  model.find({ eventName: eventName }, function (err, doc) {
    if (!err) {
      if (doc != null && doc.length > 0) {
        var eventdetails = doc;

        var eventobjt = new model(doc[0]);
        var thisEventInvited = eventobjt.invited;

        var diffEmails = thisEventInvited.filter((item) => {
          //return item.userEmail=='hello';
          return (
            invitEmails.filter((element) => element == item.userEmail).length ==
            0
          );
        });
        // res
        // .status(200)
        // .json({
        //   message: `invitEmails: ${JSON.stringify(
        //     invitEmails.toString()
        //   )} ### eventname: ${doc[0].eventName} ,diffEmails: ${JSON.stringify(
        //     diffEmails
        //   )}, thiseventinvited: ${JSON.stringify(thisEventInvited)}`,
        // });
        // now adding new email with new date in this diffemails
        //this will update date of invit emails okay
        invitEmails.forEach((element) => {
          diffEmails.push({
            userEmail: element,
            isRejected: false,
          });
        });

        //geting all invites which are not in added one...
        //  var diffThisEventInvits = thiseventinvited.filter((item) => {
        //     return !invitEmails.has(String(item.userEmail));
        //   })
        //diffEmails: ${JSON.stringify(diffEmails)}
        // res
        //   .status(200)
        //   .json({
        //     message: `diffEmails: ${JSON.stringify(diffEmails)}`,
        //   });

        var paramfilterquery = { eventName: eventName };
        var updateDictionaryList = [{ key: "invited", value: diffEmails }];

        const updateOps = {};
        for (const ops of updateDictionaryList) {
          updateOps[ops.key] = ops.value;
        }
        var filterQuery = paramfilterquery;
        var UpdateQuery = { $set: updateOps };
        model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
          if (!err) {
            res.status(200).json({
              message: `updated invited other emails also ${doc}`,
              status: true,
            });
          } else {
            res.status(500).json({ message: err });
            // return { message: `error occoured ${err}`, status: false };
          }
        });
      } else {
        res.status(404).json({ message: "event not found" });
      }
    } else {
      res.status(500).json({ message: `${err}` });
    }
  });
  //   var paramfilterquery = { eventName: eventName };
  //   var updateDictionaryList = [
  //     { key: "password", value: encryptedPassword },
  //   ];

  //   const updateOps = {};
  //   for (const ops of updateDictionaryList) {
  //     updateOps[ops.key] = ops.value;
  //   }
  //   var filterQuery = paramfilterquery;
  //   var UpdateQuery = { $set: updateOps };
  //   model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
  //     if (!err) {
  //       res.status(200).json({
  //         message: `updated SuccessFully ${doc}`,
  //         status: true,
  //       });
  //     } else {
  //       res.status(500).json({ message: err });
  //       // return { message: `error occoured ${err}`, status: false };
  //     }
  //   });
};

exports.updateJoinEvent = (req, res, next) => {
  // this mean that person is accepting invitation so ... he will be member of event
  // here will update a person email
  // email will be added in member list and will be detelet from intivation list
  var eventName = req.body.eventName;
  var yourEmailId = String(req.body.myemail);
  //before sending a invit we can check if no already given a invitation or already in member list we can check this

  model.find({ eventName: eventName }, function (err, doc) {
    if (!err) {
      if (doc != null && doc.length > 0) {
        var eventdetails = doc;

        var eventobjt = new model(doc[0]);
        var thisEventInvited = eventobjt.invited;
        var thisEventmembers= eventobjt.members;
        var isMyEmailIsInvited = thisEventInvited.filter((item) => {
          //return item.userEmail=='hello';
          return item.userEmail==yourEmailId;
        }).length==0;
if(isMyEmailIsInvited)
{
    res.status(500).json("you are not invited in this event you cannot join this event");
}
var isAlreadyMember = thisEventmembers.filter((item) => {
    //return item.userEmail=='hello';
    return item.userEmail==yourEmailId;
  }).length==0;

  if(!isAlreadyMember)
  {
      res.status(500).json("your are already a member so no need to join");
  }


  thisEventmembers.push({
    userEmail: yourEmailId,
    isActive: true,
    isAdmin: false,
  });

  var diffEmails = thisEventInvited.filter((item) => {
   return (item.userEmail!=yourEmailId) ;
  });



        var paramfilterquery = { eventName: eventName };
        var updateDictionaryList = [{ key: "invited", value: diffEmails },{ key: "members", value: thisEventmembers }];

        const updateOps = {};
        for (const ops of updateDictionaryList) {
          updateOps[ops.key] = ops.value;
        }
        var filterQuery = paramfilterquery;
        var UpdateQuery = { $set: updateOps };
        model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
          if (!err) {
            res.status(200).json({
              message: `updated invited other emails also ${doc}`,
              status: true,
            });
          } else {
            res.status(500).json({ message: err });
          }
        });
      } else {
        res.status(404).json({ message: "event not found" });
      }
    } else {
      res.status(500).json({ message: `${err}` });
    }
  });
};

exports.searchEvents = (req, res, next) => {
  //res.status(200).json("Going Good! Event is also fine");
  // here will have search from a text in mongo db some what similar event will be searched for user here .
  //db.collection.createIndex( { "$**": "text" } ) on all field if we want
  //currently setting only on eventname
  //db.reviews.createIndex( { comments: "text" } )
  // db.collection.createIndex()
  //https://docs.mongodb.com/manual/core/index-text/


//   MongoDB Enterprise > db.events.createIndex( { eventName: "text" } );
//   {
//           "createdCollectionAutomatically" : false,
//           "numIndexesBefore" : 1,
//           "numIndexesAfter" : 2,
//           "ok" : 1
//   }
//   MongoDB Enterprise >
//{ $text: { $search: "zirst Event11" } }
const search = req.body.search;
model.find({ $text: { $search: search } }, function (err, doc) {
  if (!err) {
    if (doc != null && doc.length > 0) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({ message: "No Data Found!" });
    }
  } else {
    res.status(500).json({ message: err });
  }
});
};
