const { validationResult } = require("express-validator");
const DataModel = require("../model/Data");

const user = require("../model/user");

const getData = async (req, res) => {
  try {
    const id = req.user;
    console.log(id);
    //search in collaboratives as collaborators
    const data = await DataModel.find({ contributor: { $in: [id] } }); //array
    return res.status(200).json({ success: 1, data });
  } catch (error) {
    return res.status(500).json({ success: 0, error });
  }
};

const getCollaboratorsAndData = async (req, res) => {
  try {
    if (!req.query || !req.query["dataId"]) {
      return res
        .status(400)
        .json({ success: -1, error: "No DataId is present" });
    }
    const { dataId } = req.query;
    const DocData = await DataModel.findById(dataId);

    const collaborators = await user.find({
      _id: { $in: DocData.contributor },
    });
    console.log(collaborators);
    if (DocData && collaborators) {
      return res
        .status(200)
        .json({ success: 1, data: DocData, contributor: collaborators });
    }
    return res.status(200).json({ success: -2, error: "No Data Found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: 0, error });
  }
};
const Save = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: -1, error: errors.mapped() });
    }
    //everything is ok
    const { title, delta } = req.body;

    if (req.header("x-change") === "true") {
      console.log("Save With updation of collabs");
      const { id } = req.body; //it should be present in db
      const userIds = req.userIds;
      const SaveRecord = await DataModel.findByIdAndUpdate(id, {
        $set: { title, delta },
        $push: { contributor: { $each: userIds } },
      });

      return res.status(200).json({ success: 1, SaveRecord, msg: "updated" });
    } else {
      //we need to check that it is already saved or not
      //we can check by checking client has given me id or not
      if (req.body.id) {
        console.log("update just delta");
        //means already saved so we need to just update new delta or title
        const { id } = req.body;
        const SaveRecord = await DataModel.findByIdAndUpdate(id, {
          $set: { title, delta },
        });
        return res.status(200).json({ success: 1, SaveRecord, msg: "updated" });
      } else {
        console.log("Complete Save");
        //we need to create new record
        const SaveRecord = await DataModel.create({
          title,
          delta,
          contributor: req.userIds,
        });
        return res.status(200).json({ success: 1, SaveRecord, msg: "created" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: 0, error });
  }
};
const search = async (req, res) => {
  //GET
  try {
    const q = req.query.val; //search value
    console.log(q)
    const records = await DataModel.find({
      title: { $regex: new RegExp(q, "i") },
    });
    return res.status(200).json({ success: 1, records });
  } catch (error) {
    console.log(error)
      return res.status(500).json({ success: 0, error });
  }
};
module.exports = { getData, getCollaboratorsAndData, Save,search };
