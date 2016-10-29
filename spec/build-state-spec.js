/** @babel */

import helpers from './spec-helpers'
import path from 'path'
import BuildState from '../lib/build-state'

describe('BuildState', () => {
  let state, fixturesPath, magicOverrideFilePath

  beforeEach(() => {
    fixturesPath = helpers.cloneFixtures()
    magicOverrideFilePath = path.join(fixturesPath, 'magic-comments', 'override-settings.tex')
    state = new BuildState(magicOverrideFilePath)
  })

  describe('initializeFromMagic', () => {
    it('allows magic comments to override default settings', () => {
      expect(state.outputDirectory).toEqual('wibble')
      expect(state.outputFormat).toEqual('ps')
      expect(state.producer).toEqual('xdvipdfmx')
      expect(state.engine).toEqual('lualatex')
      expect(state.jobnames).toEqual(['foo', 'bar'])
    })
  })
})
