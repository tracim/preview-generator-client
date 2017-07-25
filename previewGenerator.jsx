import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
require('./style.styl')

class PreviewGenerator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPage: 0
    }
  }

  handleClickLeftArrow = () => this.state.currentPage > 0 && this.setState({...this.state, currentPage: this.state.currentPage - 1})
  handleClickRightArrow = () => this.state.currentPage < this.props.nbPage - 1 && this.setState({...this.state, currentPage: this.state.currentPage + 1})

  handleClickDlSource = () => window.location.assign(this.props.file.sourceLink)
  handleClickDlAllPage = () => window.location.assign(this.generateFileLink('download_pdf_full'))
  handleClickDlOnePage = () => window.location.assign(this.generateFileLink('download_pdf_one'))

  generateFileLink = linkType => this.props.urlTemplate
      .replace('__FILE_ID__', this.props.file.id)
      .replace('__CURRENT_PAGE__', this.state.currentPage)
      .replace('__DOWNLOAD_TYPE__', linkType)
      .replace('__REVISION_ID__', this.props.file.selectedRevision)

  render () {
    const { urlList, file, nbPage } = this.props
    const { currentPage } = this.state

    const linkImgHd = this.generateFileLink('high_quality')

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
          <div className='previewGenerator__preview__img'>
            <a href={linkImgHd}>
              <img src={urlList[currentPage]} />
            </a>
          </div>
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
              <span>Fichier : </span>{file.name}
            </div>
            <div className='previewGenerator__data__info__size'>
              <span>Poid : </span>{file.weight}
            </div>
            <div className='previewGenerator__data__info__modifiedat'>
              Modifié le <span>{file.modifiedAt}</span> par <span>{file.owner}</span>
            </div>

            <div className='previewGenerator__data__action'>
              <div className='previewGenerator__data__action__downloadsource btn btn-success' title='Télécharger le fichier' onClick={this.handleClickDlSource}>
                <i className='fa fa-download fa-2x fa-fw' />
              </div>
              <div className='previewGenerator__data__action__downloadallpdf btn btn-default' title='Télécharger toutes les pages en pdf' onClick={this.handleClickDlAllPage}>
                <i className='fa fa-file-zip-o fa-1x fa-fw' />
              </div>
              <div className='previewGenerator__data__action__downloadsinglepdf btn btn-default' title='Télécharger cette page en pdf' onClick={this.handleClickDlOnePage}>
                <i className='fa fa-file-pdf-o fa-1x fa-fw' />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const propTypes = {
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
const previewGenerator = (anchor, urlList, nbPage, urlTemplate, file) => {
  [anchor, urlList, nbPage, file].map(oneParam => oneParam === undefined).includes(true)
    ? console.error(`Error : Wrong previewGenerator() call. previewGenerator(anchor, urlList, nbPage, urlTemplate, file: {id, name, selectedRevision, height, weight, modifiedAt, owner, sourceLink, pdfAvailable})`)
    : ReactDOM.render(<PreviewGenerator urlList={urlList} nbPage={nbPage} urlTemplate={urlTemplate} file={file} />, anchor)
}
module.exports = previewGenerator