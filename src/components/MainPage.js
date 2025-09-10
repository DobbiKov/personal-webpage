

import myphoto from "../imgs/myphoto2.png"

import MainHeader from "./MainHeader"

const Profile = () => (
            <div className="main_cont_about">
            <img src={myphoto} alt="Me" className='main_cont_about_inner'/>
            <div className='main_cont_text_about_me main_cont_about_inner'>
              <h1>Yehor Korotenko</h1>
              <h2>Developer<br/>
              Math and Comp Sci Student</h2>
              <div className='main_cont_about_inner_icons'>
                <a href="https://github.com/DobbiKov" target="_blank">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://linkedin.com/in/yehor-korotenko" target="_blank">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="mailto:yehor.korotenko@outlook.com">
                  <i className="fas fa-envelope"></i>
                </a>
                <a href="https://instagram.com/dobbikov" target="_blank">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
)

const MainPage = () => (
    <div>
      <div className="main_cont">
        <div className="main_cont_inner">
          <Profile/>
          <MainHeader remove={"main"}/>
        </div>
      </div>
    </div>
) 

export default MainPage;
export {Profile};
