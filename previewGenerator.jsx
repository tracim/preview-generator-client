import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Lightbox from 'react-images'
import { setLang, __ } from './trad.js'
require('./style.styl')

class PreviewGenerator extends React.Component {
  constructor (props) {
    super(props)
    setLang(props.lang)
    this.state = {
      currentPage: 0,
      lightboxOpen: false,
      lightboxCurrentPage: 0
    }
  }

  handleClickLeftArrow = () => this.state.currentPage > 0 && this.setState(prevState => ({
    currentPage: prevState.currentPage - 1,
    lightboxCurrentPage: prevState.currentPage - 1
  }))
  handleClickRightArrow = () => this.state.currentPage < this.props.nbPage - 1 && this.setState(prevState => ({
    currentPage: prevState.currentPage + 1,
    lightboxCurrentPage: prevState.currentPage + 1
  }))

  handleClickDlSource = () => window.location.assign(this.props.file.sourceLink)
  handleClickDlAllPage = () => window.location.assign(this.generateFileLink('download_pdf_full'))
  handleClickDlOnePage = () => window.location.assign(this.generateFileLink('download_pdf_one'))

  generateFileLink = (linkType, pageNb) => this.props.urlTemplate
      .replace('__FILE_ID__', this.props.file.id)
      .replace('__CURRENT_PAGE__', pageNb)
      .replace('__DOWNLOAD_TYPE__', linkType)
      .replace('__REVISION_ID__', this.props.file.selectedRevision)

  handleOpenLightbox = () => this.setState({lightboxOpen: true})
  handleCloseLightbox = () => this.setState({lightboxOpen: false})

  render () {
    const { urlList, file, nbPage } = this.props
    const { currentPage } = this.state

    return (
      <div className='previewGenerator'>
        <div className='previewGenerator__preview'>
          { nbPage > 1 &&
            <div
              className={classnames('previewGenerator__preview__arrow', 'arrowleft', {disabled: currentPage <= 0})}
              style={{height: file.height + 'px'}}
              onClick={this.handleClickLeftArrow}
            >
              <i className='fa fa-chevron-left' />
            </div>
          }
          <div className='previewGenerator__preview__img' onClick={this.handleOpenLightbox}>
            <img src={urlList[currentPage]} />
          </div>
          <Lightbox
            images={urlList.map((img, i) => ({src: this.generateFileLink('high_quality', i)}))}
            currentImage={this.state.lightboxCurrentPage}
            isOpen={this.state.lightboxOpen}
            onClose={() => this.setState({lightboxOpen: false, lightboxCurrentPage: currentPage})}
            onClickPrev={() => this.setState(prevState => ({lightboxCurrentPage: prevState.lightboxCurrentPage - 1}))}
            onClickNext={() => this.setState(prevState => ({lightboxCurrentPage: prevState.lightboxCurrentPage + 1}))}
            backdropClosesModal
            leftArrowTitle={__('Previous')}
            rightArrowTitle={__('Next')}
            closeButtonTitle={__('Close')}
          />
          { nbPage > 1 &&
            <div
              className={classnames('previewGenerator__preview__arrow', 'arrowright', {disabled: currentPage >= nbPage - 1})}
              style={{height: file.height + 'px'}}
              onClick={this.handleClickRightArrow}
            >
              <i className='fa fa-chevron-right' />
            </div>
          }
        </div>

        <div className='previewGenerator__data'>
          <div className='previewGenerator__data__info'>
            <div className='previewGenerator__data__info__title'>
              <span>{__('File: ')}</span>{file.name}
            </div>
            <div className='previewGenerator__data__info__size'>
              <span>{__('Size: ')}</span>{file.weight}
            </div>
            <div className='previewGenerator__data__info__modifiedat'>
              {__('Last modification ')}<span>{file.modifiedAt}</span>{__(' by ')}<span>{file.owner}</span>
            </div>

            <div className='previewGenerator__data__action'>
              <div className='previewGenerator__data__action__downloadsource btn btn-success' title={__('Download file')} onClick={this.handleClickDlSource}>
                <i className='fa fa-download fa-2x fa-fw' />
              </div>
              { file.pdfAvailable && (
                <div className='previewGenerator__data__action__downloadallpdf btn btn-default' title={__('Download all pages as pdf')} onClick={this.handleClickDlAllPage}>
                  <i className='fa fa-file-zip-o fa-1x fa-fw' />
                </div>
              )}
              { file.pdfAvailable && (
                <div className='previewGenerator__data__action__downloadsinglepdf btn btn-default' title={__('Download this page as pdf')} onClick={this.handleClickDlOnePage}>
                  <i className='fa fa-file-pdf-o fa-1x fa-fw' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const propTypes = {
  lang: PropTypes.string.isRequired,
  urlList: PropTypes.array.isRequired,
  nbPage: PropTypes.number.isRequired,
  file: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selectedRevision: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    weight: PropTypes.string.isRequired,
    modifiedAt: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    sourceLink: PropTypes.string.isRequired,
    pdfAvailable: PropTypes.bool.isRequired
  })
}

PreviewGenerator.PropTypes = propTypes

// wrapper for app launcher (it's better to have the wrapper in a separated file but since this app can only be used for tracim, it's not required)
const previewGenerator = (anchor, lang, urlList, nbPage, urlTemplate, file) => {
  [anchor, lang, urlList, nbPage, urlTemplate, file].map(oneParam => oneParam === undefined).includes(true)
    ? console.error(`Error : Wrong previewGenerator() call. previewGenerator(anchor, lang, urlList, nbPage, urlTemplate, file: {
      id,
      name,
      selectedRevision,
      height,
      weight,
      modifiedAt,
      owner,
      sourceLink,
      pdfAvailable
    })`)
    : ReactDOM.render(<PreviewGenerator lang={lang} urlList={urlList} nbPage={nbPage} urlTemplate={urlTemplate} file={file} />, anchor)
}
module.exports = previewGenerator
