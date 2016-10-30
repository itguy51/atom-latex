/** @babel */

import BuildStep from '../build-step'
import MagicParser from '../parsers/magic-parser'

export default class MagicParseStep extends BuildStep {
  async run (state) {
    const magic = this.getMagic(state)

    if (magic.format) {
      state.outputFormat = magic.format
    }

    if (magic.jobnames) {
      state.jobnames = magic.jobnames.split(/\s+/)
    } else if (magic.jobname) {
      state.jobnames = [magic.jobname]
    }

    if (magic.output_directory) {
      state.outputDirectory = magic.output_directory
    }

    if (magic.program) {
      state.engine = magic.program
    }

    if (magic.producer) {
      state.producer = magic.producer
    }
  }

  getMagic (state) {
    return new MagicParser(state.rootFilePath).parse()
  }
}
