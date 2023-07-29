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

//用課程名稱查詢課程資訊
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    console.log(Course.find());
    let courseFound = await Course.find({ title: name })
      .populate("teacher", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.send(500).send(e);
  }
});

//用課程ID查詢課程資訊
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

//查詢特定講師的課程
router.get("/teacher/:teacher_id", async (req, res) => {
  let { teacher_id } = req.params;
  let courseFound = await Course.find({ teacher: teacher_id })
    .populate("teacher", ["username", "eamil"])
    .exec();
  return res.send(courseFound);
});

//查詢特定學生註冊課程
router.get("/student/:student_id", async (req, res) => {
  let { student_id } = req.params;
  let courseFound = await Course.find({ students: student_id })
    .populate("teacher", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

//利用課程ID註冊課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  console.log(_id);
  let course = await Course.findOne({ _id }).exec();
  if (!course.students.includes(req.user._id)) {
    course.students.push(req.user._id);
    await course.save();
    res.send("註冊成功");
  } else {
    res.send("註冊失敗");
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
