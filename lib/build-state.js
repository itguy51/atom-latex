/** @babel */

import path from 'path'
import MagicParser from './parsers/magic-parser'

export default class BuildState {
  constructor (rootFilePath) {
    Object.defineProperties(this, {
      rootFilePath: {
        value: rootFilePath
      },
      projectPath: {
        value: path.dirname(rootFilePath)
      },
      enableShellEscape: {
        writable: true
      },
      enableSynctex: {
        writable: true
      },
      engine: {
        writable: true
      },
      jobnames: {
        writable: true
      },
      outputDirectory: {
        writable: true
      },
      outputFormat: {
        writable: true
      },
      producer: {
        writable: true
      }
    })

    this.initializeFromConfig()
    this.initializeFromMagic()
  }

  getMagic () {
    return new MagicParser(this.rootFilePath).parse()
  }

  initializeFromConfig () {
    this.enableShellEscape = atom.config.get('latex.enableShellEscape')

    this.enableSynctex = atom.config.get('latex.enableSynctex')

    this.engine = atom.config.get('latex.customEngine')
    if (!this.engine) this.engine = atom.config.get('latex.engine')

    this.jobnames = [null]

    this.outputDirectory = atom.config.get('latex.outputDirectory')

    this.outputFormat = atom.config.get('latex.outputFormat')

    this.producer = atom.config.get('latex.producer')
  }

  initializeFromMagic () {
    const magic = this.getMagic()

    if (magic.format) {
      this.outputFormat = magic.format
    }

    if (magic.jobname) {
      this.jobnames = [magic.jobname]
    }
    if (magic.jobnames) {
      this.jobnames = magic.jobnames.split(/\s+/)
    }

    if (magic.output_directory) {
      this.outputDirectory = magic.output_directory
    }

    if (magic.program) {
      this.engine = magic.program
    }

    if (magic.producer) {
      this.producer = magic.producer
    }
  }
}
