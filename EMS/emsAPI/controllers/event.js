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

// {
//     "eventName": "Ffvesdnt11",
//     "userEmail": "add207@yahoo.com",
//     "details":"details ofr emvetn",
//     "invitations":"hello@1123.comom,abc@sdfs.xyz"

// }
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


exports.invitInEvent = (req, res, next) => {
  //the one who create event is alway admin and when person who will accept invitation they will be member of group okay
  var eventName = req.body.eventName;
  var invitEmails = req.body.emails;
  //before sending a invit we can check if no already given a invitation or already in member list we can check this
  var paramfilterquery = { eventName: eventName };
  var updateDictionaryList = [
    { key: "password", value: encryptedPassword }
  ];
  const updateOps = {};
  for (const ops of updateDictionaryList) {
    updateOps[ops.key] = ops.value;
  }
  var filterQuery = paramfilterquery;
  var UpdateQuery = { $set: updateOps };
  model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
    if (!err) {
      res
        .status(200)
        .json({
          message: `updated SuccessFully ${doc}`,
          status: true
        });
    } else {
      res.status(500).json({ message: err });
      // return { message: `error occoured ${err}`, status: false };
    }
  });
};

exports.checkMyEventAndInvites = (req, res, next) => {
  // for the given email id
  //get all event name where person is member
  //get all eventname where person is invited
  res.status(200).json("Going Good! Event is also fine");
};

exports.getSortEventByName = (req, res, next) => {
  // show event name
  //member of event
  // invites of event
  res.status(200).json("Going Good! Event is also fine");
};

exports.updateEvent = (req, res, next) => {
    res.status(200).json("Going Good! Event is also fine");
  // update event description here vai event name.
};

exports.updateJoinEvent = (req, res, next) => {
    res.status(200).json("Going Good! Event is also fine");
  // this mean that person is accepting invitation so ... he will be member of event
  // here will update a person email
  // email will be added in member list and will be detelet from intivation list
};


exports.searchEvents = (req, res, next) => {
    res.status(200).json("Going Good! Event is also fine");
  // here will have search from a text in mongo db some what similar event will be searched for user here .
};
exports.filterByDate = (req, res, next) => {
    // here will have search from a text in mongo db some what similar event will be searched for user here .
    res.status(200).json("Going Good! Event is also fine"); 
};