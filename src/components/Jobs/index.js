import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import {IoIosStar} from 'react-icons/io'
import {IoLocation} from 'react-icons/io5'
import {FaBriefcase} from 'react-icons/fa'
import Header from '../Header'

import './index.css'

const profileApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
  empty: 'EMPTY',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: profileApiConstants.initial,
    jobsListApiStatus: profileApiConstants.initial,
    jobsList: [],
    selectedEmploymentTypes: [],
    selectedSalary: '',
    searchInput: '',
    selectedJobId: null,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsList()
  }

  onChangeTypeOfEmployement = event => {
    const selectedType = event.target.id
    this.setState(prevState => {
      const {selectedEmploymentTypes} = prevState

      if (selectedEmploymentTypes.includes(selectedType)) {
        return {
          selectedEmploymentTypes: selectedEmploymentTypes.filter(
            type => type !== selectedType,
          ),
        }
      }
      return {
        selectedEmploymentTypes: [...selectedEmploymentTypes, selectedType],
      }
    }, this.getJobsList)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getJobsList)
  }

  onChangeSalaryRange = event => {
    const {value} = event.target
    this.setState({selectedSalary: value}, this.getJobsList)
  }

  onClickJobsRetryBtn = () => {
    this.getJobsList()
  }

  onClickProfileFailureBtn = () => {
    this.getProfile()
  }

  onClickJobCard = id => {
    this.setState({selectedJobId: id})
  }

  getProfile = async () => {
    this.setState({profileApiStatus: profileApiConstants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedProfileData,
        profileApiStatus: profileApiConstants.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiConstants.failure})
    }
  }

  getJobsList = async () => {
    const {selectedEmploymentTypes, selectedSalary, searchInput} = this.state
    const employmentTypesParam = selectedEmploymentTypes.join(',')
    this.setState({jobsListApiStatus: profileApiConstants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesParam}&minimum_package=${selectedSalary}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedJobsData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
        packagePerAnnum: each.package_per_annum,
      }))

      if (data.jobs.length === 0) {
        this.setState({
          jobsListApiStatus: profileApiConstants.empty,
        })
      } else if (data.jobs.length !== 0) {
        this.setState({
          jobsList: updatedJobsData,
          jobsListApiStatus: profileApiConstants.success,
        })
      }
    } else {
      this.setState({jobsListApiStatus: profileApiConstants.failure})
    }
  }

  renderProvileView = () => {
    const {profileDetails, profileApiStatus} = this.state

    switch (profileApiStatus) {
      case profileApiConstants.success:
        return (
          <div className="profile-container">
            <img
              src={profileDetails.profileImageUrl}
              alt="profile"
              className="profile-img"
            />
            <h1 className="profile-heading">{profileDetails.name}</h1>
            <p className="profile-bio">{profileDetails.shortBio}</p>
          </div>
        )
      case profileApiConstants.failure:
        return (
          <div className="profile-failure-container">
            <button
              className="retry-btn"
              onClick={this.onClickProfileFailureBtn}
            >
              Retry
            </button>
          </div>
        )
      case profileApiConstants.in_progress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      default:
        return null
    }
  }

  renderTypeOfEmployment = () => {
    const {employmentTypesList} = this.props
    const {selectedEmploymentTypes} = this.state
    return (
      <div className="employment-container">
        <h1 className="type-of-employment">Type of Employment</h1>
        <ul className="check-box-container">
          {employmentTypesList.map(each => (
            <li className="filter-input-container" key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                className="checkbox-input"
                checked={selectedEmploymentTypes.includes(
                  each.employmentTypeId,
                )}
                onChange={this.onChangeTypeOfEmployement}
              />
              <label
                htmlFor={each.employmentTypeId}
                className="employment-label"
              >
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSalaryRange = () => {
    const {salaryRangesList} = this.props
    const {selectedSalary} = this.state
    return (
      <div className="employment-container">
        <h1 className="type-of-employment">Salary Range</h1>
        <ul className="check-box-container">
          {salaryRangesList.map(each => (
            <li className="filter-input-container" key={each.salaryRangeId}>
              <input
                type="radio"
                id={each.salaryRangeId}
                checked={selectedSalary === each.salaryRangeId}
                className="checkbox-input"
                name="salaryRange"
                value={each.salaryRangeId}
                onChange={this.onChangeSalaryRange}
              />
              <label htmlFor={each.salaryRangeId} className="employment-label">
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobs = () => {
    const {jobsList, jobsListApiStatus, selectedJobId} = this.state
    if (selectedJobId) {
      return <Redirect to={`/jobs/${selectedJobId}`} />
    }
    switch (jobsListApiStatus) {
      case profileApiConstants.success:
        return (
          <ul>
            {jobsList.map(each => (
              <li
                className="job-card"
                key={each.id}
                onClick={() => this.onClickJobCard(each.id)}
              >
                <div className="logo-container">
                  <div className="logo">
                    <img
                      src={each.companyLogoUrl}
                      alt="company logo"
                      className="job-logo-img"
                    />
                  </div>
                  <div className="job-name-container">
                    <h1 className="job-name">{each.title}</h1>
                    <div className="rating-container">
                      <IoIosStar className="star" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="type-container">
                  <div className="first-type">
                    <div className="location-container">
                      <IoLocation className="location-img" />
                      <p className="location">{each.location}</p>
                    </div>
                    <div className="location-container job-type">
                      <FaBriefcase className="location-img" />
                      <p className="location">{each.employmentType}</p>
                    </div>
                  </div>
                  <p className="lpa">{each.packagePerAnnum}</p>
                </div>
                <hr className="seperator" />
                <h3 className="description-head">Description</h3>
                <p className="description">{each.jobDescription}</p>
              </li>
            ))}
          </ul>
        )
      case profileApiConstants.failure:
        return (
          <div className="jobs-failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              className="jobs-failure-img"
              alt="failure view"
            />
            <h1 className="failure-heading">Oops! Something Went Wrong.</h1>
            <p className="failure-msg">
              We cannot seem to find the page you are looking for
            </p>
            <button className="retry-btn" onClick={this.onClickJobsRetryBtn}>
              Retry
            </button>
          </div>
        )
      case profileApiConstants.in_progress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )

      case profileApiConstants.empty:
        return (
          <div className="jobs-failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="empty-img"
            />
            <h1 className="failure-heading">No Jobs Found</h1>
            <p className="failure-msg">
              We could not find any jobs. Try other filters.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="filters-container">
            <div className="search-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn-container"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            {this.renderProvileView()}
            <hr className="seperator" />
            {this.renderTypeOfEmployment()}
            <hr className="seperator" />
            {this.renderSalaryRange()}
          </div>
          <div className="jobs-list-container">
            <div className="search-input-container-1">
              <input
                type="search"
                className="search-input-1"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn-container-1"
              >
                <BsSearch className="search-icon-1" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
