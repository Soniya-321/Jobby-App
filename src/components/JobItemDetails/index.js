import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {IoIosStar} from 'react-icons/io'
import {IoLocation} from 'react-icons/io5'
import {FaBriefcase} from 'react-icons/fa'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {jobItemDetails: {}, jobDetailsApi: apiConstants.initial}

  componentDidMount() {
    this.getJobItemDetails()
  }

  onClickFailureBtn = () => {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({jobDetailsApi: apiConstants.in_progress})
    const {match} = this.props
    const {id} = match.params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const jobItemUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobItemUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const jobdetails = data.job_details
      const jobDetails = {
        companyLogoUrl: jobdetails.company_logo_url,
        companyWebsiteUrl: jobdetails.company_website_url,
        employmentType: jobdetails.employment_type,
        jobDescription: jobdetails.job_description,
        location: jobdetails.location,
        packagePerAnnum: jobdetails.package_per_annum,
        rating: jobdetails.rating,
        title: jobdetails.title,
        skills: jobdetails.skills,
        lifeAtCompany: jobdetails.life_at_company,
      }

      const similarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const updatedJobDetails = {jobDetails, similarJobs}
      this.setState({
        jobItemDetails: updatedJobDetails,
        jobDetailsApi: apiConstants.success,
      })
    } else {
      this.setState({
        jobDetailsApi: apiConstants.failure,
      })
    }
  }

  renderJobDetailsView = () => {
    const {jobItemDetails} = this.state
    const {jobDetails, similarJobs} = jobItemDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
      lifeAtCompany,
    } = jobDetails
    console.log(lifeAtCompany)
    return (
      <>
        <ul className="details-container">
          <li className="job-details-card">
            <div className="logo-container">
              <div className="logo">
                <img
                  src={companyLogoUrl}
                  alt=" job details company logo"
                  className="job-logo-img"
                />
              </div>
              <div className="job-name-container">
                <h1 className="job-name">{title}</h1>
                <div className="rating-container">
                  <IoIosStar className="star" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="type-container">
              <div className="first-type">
                <div className="location-container">
                  <IoLocation className="location-img" />
                  <p className="location">{location}</p>
                </div>
                <div className="location-container job-type">
                  <FaBriefcase className="location-img" />
                  <p className="location">{employmentType}</p>
                </div>
              </div>
              <p className="lpa">{packagePerAnnum}</p>
            </div>
            <hr className="seperator" />
            <div className="description-container">
              <h3 className="description-head">Description</h3>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="website-url"
              >
                Visit <FiExternalLink />
              </a>
            </div>
            <p className="description">{jobDescription}</p>
            <h3 className="description-head">Skills</h3>
            <ul className="skills-container">
              {skills.map(each => (
                <li className="skill-item" key={each.name}>
                  <img
                    src={each.image_url}
                    alt={each.name}
                    className="skill-img"
                  />
                  <h3 className="description-head">{each.name}</h3>
                </li>
              ))}
            </ul>
            <div className="life-at-company-container">
              <div>
                <h3 className="description-head">Life At Company</h3>
                <p className="description">{lifeAtCompany.description}</p>
              </div>
              <img
                src={lifeAtCompany.image_url}
                alt="life at company"
                className="website-img"
              />
            </div>
          </li>
        </ul>
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs">
            {similarJobs.map(each => (
              <li className="similar-jobs-card" key={each.id}>
                <div className="logo-container">
                  <div className="logo">
                    <img
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
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

                <h3 className="description-head">Description</h3>
                <p className="description">{each.jobDescription}</p>
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
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobs-failure-img"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong.</h1>
      <p className="failure-msg">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry-btn" onClick={this.onClickFailureBtn}>
        Retry
      </button>
    </div>
  )

  renderAllViews = () => {
    const {jobDetailsApi} = this.state
    switch (jobDetailsApi) {
      case apiConstants.success:
        return this.renderJobDetailsView()
      case apiConstants.failure:
        return this.renderJobsFailureView()
      case apiConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderAllViews()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
