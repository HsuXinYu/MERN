import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const nav = useNavigate();
  const handleToLogin = () => {
    nav("/login");
  };
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role == "teacher") {
        CourseService.get(_id)
          .then((data) => {
            console.log(data);
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role == "student") {
        CourseService.getEnrolledCourses(_id)
          .then((data) => {
            console.log(data);
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>你必須先登入才能看到課程</p>
          <button onClick={handleToLogin} className="btn btn-primary btn-lg">
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "teacher" && (
        <h1>歡迎來到講師頁面</h1>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <h1>歡迎來到學生頁面</h1>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p className="card-text">學生人數:{course.students.length}</p>
                  <p className="card-text">課程價格:{course.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
