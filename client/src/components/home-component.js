import React from "react";
import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
  const nav = useNavigate();

  const handleTakeToRegister = () => {
    nav("/register");
  };
  const handleTakeToLogin = () => {
    nav("/login");
  };

  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3 row">
          <div className="col">
            <img
              sizes="(max-width: 768px) 768px, 1280px"
              src={"./img/course.svg"}
            />
          </div>
          <div className="py-5 col">
            <h1 className="display-5 fw-bold">學習系統</h1>
            <p className="col-md-8 fs-4">
              本系統使用 React.js 作為前端框架，Node.js、MongoDB
              作為後端服務器。
            </p>
          </div>
        </div>

        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>作為一個學生</h2>
              <p>
                學生可以註冊他們喜歡的課程。本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <button
                className="btn btn-outline-light"
                type="button"
                onClick={handleTakeToLogin}
              >
                登入會員或者註冊一個帳號
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>作為一個導師</h2>
              <p>
                您可以通過註冊成為一名講師，並開始製作在線課程。本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleTakeToRegister}
              >
                註冊成為講師，開始開設課程
              </button>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          © 2023 HSU XIN YU All Rights Reserved
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
