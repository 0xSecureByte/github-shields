import { ServiceTester } from '../tester.js'
import {
  isMetric,
  isVPlusDottedVersionNClauses,
  isVPlusDottedVersionNClausesWithOptionalSuffix,
} from '../test-validators.js'

export const t = new ServiceTester({
  id: 'resharper',
  title: 'ReSharper',
})

// downloads

t.create('total downloads (valid)')
  .get('/dt/StyleCop.StyleCop.json')
  .expectBadge({
    label: 'downloads',
    message: isMetric,
  })

t.create('total downloads (not found)')
  .get('/dt/not-a-real-package.json')
  .expectBadge({ label: 'downloads', message: 'not found' })

// version

t.create('version (valid)').get('/v/StyleCop.StyleCop.json').expectBadge({
  label: 'resharper',
  message: isVPlusDottedVersionNClauses,
})

t.create('version (not found)')
  .get('/v/not-a-real-package.json')
  .expectBadge({ label: 'resharper', message: 'not found' })

// version (pre)

t.create('version (pre) (valid)')
  .get('/v/StyleCop.StyleCop.json?include_prereleases')
  .expectBadge({
    label: 'resharper',
    message: isVPlusDottedVersionNClausesWithOptionalSuffix,
  })

t.create('version (pre) (not found)')
  .get('/v/not-a-real-package.json?include_prereleases')
  .expectBadge({ label: 'resharper', message: 'not found' })

t.create('version (legacy redirect: vpre)')
  .get('/vpre/StyleCop.StyleCop.svg')
  .expectRedirect('/resharper/v/StyleCop.StyleCop.svg?include_prereleases')
