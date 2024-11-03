import {AiFillHome} from 'react-icons/ai'
import {FaBriefcase} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="header-container">
      <div className="logo-container">
        <Link to="/" className="link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="logo-home"
            alt="website logo"
          />
        </Link>
      </div>
      <ul className="options-container">
        <Link to="/" className="link">
          <AiFillHome className="icon" />
        </Link>
        <Link to="/jobs" className="link">
          <FaBriefcase className="icon" />
        </Link>
        <Link to="/login" className="link" onClick={onClickLogout}>
          <FiLogOut className="icon" />
        </Link>
      </ul>
      <ul className="options">
        <Link to="/" className="link">
          <li className="link-item">Home</li>
        </Link>
        <Link to="/jobs" className="link">
          <li className="link-item">Jobs</li>
        </Link>
      </ul>
      <div className="logout-container">
        <Link to="/login" className="link" onClick={onClickLogout}>
          <li className="link-item">
            <button type="button" className="logout-btn">
              Logout
            </button>
          </li>
        </Link>
      </div>
    </div>
  )
}
export default withRouter(Header)
