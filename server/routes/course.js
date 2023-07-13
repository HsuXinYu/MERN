const { castObject } = require("../models/user-model");

const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course正在接收一個request");
  next();
});

//查詢所有課程資訊
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("teacher", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//查詢特定課程資訊
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("teacher", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.send(500).send(e);
  }
});

//新增課程
router.post("/", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res.status(400).send("只有講師能發佈新課程");
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      teacher: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({
      msg: "新課程已經保存",
      savedCourse,
    });
  } catch (e) {
    return res.status(500).send("無法創建課程");
  }
});

//更改課程
router.patch("/:_id", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id });

    if (!courseFound) {
      return res.status(400).send("找不到此課程，無法更新課程");
    }

    if (courseFound.teacher.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        msg: "課程資訊已更新",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程講師才能編輯課程資訊");
    }
  } catch (e) {
    console.warn(e);
    return res.status(500).send(e);
  }
});

//刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id });

    if (!courseFound) {
      return res.status(400).send("找不到此課程，無法刪除課程");
    }

    if (courseFound.teacher.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已刪除");
    } else {
      return res.status(403).send("只有此課程講師才能刪除課程");
    }
  } catch (e) {
    console.warn(e);
    return res.status(500).send(e);
  }
});

module.exports = router;
