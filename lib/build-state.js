/** @babel */

import path from 'path'
import MagicParser from './parsers/magic-parser'

class JobState {
  constructor () {
    Object.defineProperties(this, {
      generatedFilePaths: {
        value: new Set()
      }
    })
  }
}

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
        get: () => Array.from(this.jobStates.keys()),
        set: value => {
          this.jobStates.clear()
          for (const jobname of value) {
            this.jobStates.set(jobname, new JobState())
          }
        }
      },
      jobStates: {
        value: new Map()
      },
      outputDirectory: {
        writable: true
      },
      outputFormat: {
        writable: true
      },
      producer: {
        writable: true
      },
      shouldRebuild: {
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

    this.shouldRebuild = false
  }

  initializeFromMagic () {
    const magic = this.getMagic()

    if (magic.format) {
      this.outputFormat = magic.format
    }

    if (magic.jobnames) {
      this.jobnames = magic.jobnames.split(/\s+/)
    } else if (magic.jobname) {
      this.jobnames = [magic.jobname]
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

  resolveOutputFilePath (jobname, ext) {
    const dir = path.join(this.projectPath, this.outputDirectory)
    let { name } = path.parse(this.rootFilePath)
    if (jobname) name = jobname
    return path.format({ dir, name, ext })
  }

  getFilePath (jobname, extensions) {
    if (extensions.includes(path.extname(this.rootFilePath))) {
      return this.rootFilePath
    }

    const jobState = this.jobStates.get(jobname)
    for (const filePath of jobState.generatedFilePaths.values()) {
      if (extensions.includes(path.extname(filePath))) {
        return filePath
      }
    }
  }

}
