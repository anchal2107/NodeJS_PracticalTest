const express = require("express");
const router = express.Router();
const controller = require("../controllers/event");
const checkAuth = require('../middlewares/check-auth')
router.get("/testReturnEvent", controller.testReturnEvent);
// //for ease of testing not adding middleware for now
//router.post('/createEvent',checkAuth,  controller.createEvent);
// middleware working is shown in user also router.post('/changePassword',checkAuth,  controller.changePassword);
// router.post("/createSimpleEvent", controller.createSimpleEvent);
// router.post("/createComplexEvent", controller.createComplexEvent);
// //to use this with middleware can also make it post and add header token in post 
// router.get("/listAllEvents", controller.listAllEvents);
// router.post("/invitInEvent", controller.invitInEvent);
// router.post("/checkMyEventAndInvites", controller.checkMyEventAndInvites);
// router.post("/getSortEventByName", controller.getSortEventByName);
// router.post("/updateEvent", controller.updateEvent);
// router.post("/updateJoinEvent", controller.updateJoinEvent);
// router.post("/SearchEvents", controller.searchEvents);
// router.post("/filterByDate", controller.filterByDate);
// router.post("/getEventbyName", controller.getEventbyName);


/// Admin Middle ware in every query as per need
router.post("/createSimpleEvent",checkAuth, controller.createSimpleEvent);
router.post("/createComplexEvent", controller.createComplexEvent);
//to use this with middleware can also make it post and add header token in post 
router.get("/listAllEvents",checkAuth,  controller.listAllEvents);
router.post("/invitInEvent",checkAuth,  controller.invitInEvent);
router.post("/checkMyEventAndInvites",checkAuth,  controller.checkMyEventAndInvites);
router.post("/getSortEventByName",checkAuth,  controller.getSortEventByName);
router.post("/updateEvent",checkAuth,  controller.updateEvent);
router.post("/updateJoinEvent",checkAuth,  controller.updateJoinEvent);
router.post("/SearchEvents",checkAuth,  controller.searchEvents);
router.post("/filterByDate",checkAuth,  controller.filterByDate);
router.post("/getEventbyName",checkAuth,  controller.getEventbyName);

router.post("/searchFilterDateSort",checkAuth,  controller.searchFilterDateSort);



module.exports = router;
