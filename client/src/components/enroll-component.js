import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EnrollComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [courseData, setCourseData] = useState(null);
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    CourseService.getCourse()
      .then((data) => {
        console.log(data);
        setCourseData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleTakeToLogin = () => {
    nav("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = (e) => {
    if (searchInput) {
      let courseFound = courseData.filter((course) => {
        let content = course.title.toLowerCase();
        let keyword = searchInput.toLowerCase();
        return content.indexOf(keyword) != -1;
      });
      setSearchResult(courseFound);
    } else {
      CourseService.getCourse()
        .then((data) => {
          console.log(data);
          setCourseData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // CourseService.getCourseByName(searchInput)
    //   .then((data) => {
    //     console.log(data);
    //     setSearchResult(data.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then((res) => {
        console.log(res);
        if (res == "註冊成功") {
          window.alert("課程註冊成功。重新導向到課程頁面。");
          nav("/course");
        } else {
          window.alert("你已註冊過此課程。");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            className="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            搜尋課程
          </button>
        </div>
      )}
      {currentUser && searchResult && searchResult.length != 0 && (
        <div className="row mt-3">
          {searchResult.map((course) => (
            <div
              key={course._id}
              className="card m-1"
              style={{ width: "18rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">課程名稱：{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>價格: {course.price}</p>
                <p>目前的學生人數: {course.students.length}</p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text btn btn-primary"
                  id={course._id}
                >
                  註冊課程
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div className="row mt-3">
          <p>所有課程</p>
          {courseData.map((course) => (
            <div
              key={course._id}
              className="card m-1"
              style={{ width: "18rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">課程名稱：{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>價格: {course.price}</p>
                <p>目前的學生人數: {course.students.length}</p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text btn btn-primary"
                  id={course._id}
                >
                  註冊課程
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
