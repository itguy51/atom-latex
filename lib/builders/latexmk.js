/** @babel */

import path from 'path'
import Builder from '../builder'

const LATEX_PATTERN = /^latex|u?platex$/

export default class LatexmkBuilder extends Builder {
  executable = 'latexmk'

  static canProcess (filePath) {
    return path.extname(filePath) === '.tex'
  }

  async run (state, filePath, jobname, shouldRebuild) {
    const args = this.constructArgs(state, filePath, jobname, shouldRebuild)
    const command = `${this.executable} ${args.join(' ')}`
    const options = this.constructChildProcessOptions(filePath, { max_print_line: 1000 })

    const { statusCode } = await latex.process.executeChildProcess(command, options)
    return statusCode
  }

  logStatusCode (statusCode) {
    switch (statusCode) {
      case 10:
        latex.log.error('latexmk: Bad command line arguments.')
        break
      case 11:
        latex.log.error('latexmk: File specified on command line not found or other file not found.')
        break
      case 12:
        latex.log.error('latexmk: Failure in some part of making files.')
        break
      case 13:
        latex.log.error('latexmk: error in initialization file.')
        break
      case 20:
        latex.log.error('latexmk: probable bug or retcode from called program.')
        break
      default:
        super.logStatusCode(statusCode)
    }
  }

  constructArgs (state, filePath, jobname, shouldRebuild) {
    const args = [
      '-interaction=nonstopmode',
      '-f',
      '-cd',
      '-file-line-error'
    ]

    if (shouldRebuild) {
      args.push('-g')
    }
    if (jobname) {
      args.push(`-jobname=${jobname}`)
    }
    if (state.enableShellEscape) {
      args.push('-shell-escape')
    }
    if (state.enableSynctex) {
      args.push('-synctex=1')
    }

    if (state.engine.match(LATEX_PATTERN)) {
      args.push(`-latex="${state.engine}"`)
      args.push(state.outputFormat === 'pdf'
        ? this.constructPdfProducerArgs(state, filePath)
        : `-${state.outputFormat}`)
    } else {
      args.push(`-pdflatex="${state.engine}"`)
      args.push(`-${state.outputFormat}`)
    }

    if (state.outputDirectory) {
      args.push(`-outdir="${state.outputDirectory}"`)
    }

    args.push(`"${filePath}"`)
    return args
  }

  constructPdfProducerArgs (state, filePath) {
    switch (state.producer) {
      case 'ps2pdf':
        return '-pdfps'
      case 'dvipdf':
        return '-pdfdvi -e "$dvipdf = \'dvipdf %O %S %D\';"'
      default:
        return `-pdfdvi -e "$dvipdf = \'${state.producer} %O -o %D %S\';"`
    }
  }
}
