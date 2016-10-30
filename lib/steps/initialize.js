/** @babel */

import BuildStep from '../build-step'

export default class InitializeStep extends BuildStep {
  async run (state) {
    state.enableShellEscape = atom.config.get('latex.enableShellEscape')

    state.enableSynctex = atom.config.get('latex.enableSynctex')

    state.engine = atom.config.get('latex.customEngine')
    if (!state.engine) state.engine = atom.config.get('latex.engine')

    state.jobnames = [null]

    this.outputDirectory = atom.config.get('latex.outputDirectory')

    this.outputFormat = atom.config.get('latex.outputFormat')

    this.producer = atom.config.get('latex.producer')
  }
}
