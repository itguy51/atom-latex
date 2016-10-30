/** @babel */

import path from 'path'
import Builder from '../builder'

export default class TexifyBuilder extends Builder {
  executable = 'texify'

  static canProcess (filePath) {
    return path.extname(filePath) === '.tex'
  }

  async run (state, jobname = null) {
    const filePath = state.getFilePath(jobname, ['.tex', '.lhs'])
    const args = this.constructArgs(state, filePath, jobname)
    const command = `${this.executable} ${args.join(' ')}`
    const options = this.constructChildProcessOptions(filePath, { BIBTEX: 'biber' })

    const { statusCode } = await latex.process.executeChildProcess(command, options)
    return statusCode
  }

  constructArgs (state, filePath, jobname) {
    const args = [
      '--batch',
      '--pdf',
      '--tex-option="--interaction=nonstopmode"',
      // Set logfile max line length.
      '--tex-option="--max-print-line=1000"'
    ]

    if (jobname) {
      args.push(`--tex-option="--job-name=${jobname}"`)
    }
    if (state.enableShellEscape) {
      args.push('--tex-option=--enable-write18')
    }
    if (state.enableSynctex) {
      args.push('--tex-option="--synctex=1"')
    }

    switch (state.engine) {
      case 'xelatex':
        args.push('--engine=xetex')
        break
      case 'lualatex':
        args.push('--engine=luatex')
        break
      case 'pdflatex':
        break
      default:
        args.push(`--engine="${state.engine}"`)
    }

    if (state.outputDirectory) {
      atom.notifications.addWarning(
        'Output directory functionality is poorly supported by texify, ' +
        'so this functionality is disabled (for the foreseeable future) ' +
        'when using the texify builder.'
      )
    }

    args.push(`"${filePath}"`)
    return args
  }
}
