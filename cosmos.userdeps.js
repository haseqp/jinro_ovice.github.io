import fixture0 from './src/components/hunter/index.fixture.tsx';
import fixture1 from './src/components/wolf/index.fixture.tsx';
import fixture2 from './src/components/seer/index.fixture.tsx';

import decorator0 from './src/cosmos.decorator.tsx';

export const rendererConfig = {
  "port": 5231
};

export const fixtures = {
  'src/components/hunter/index.fixture.tsx': { module: { default: fixture0 } },
  'src/components/wolf/index.fixture.tsx': { module: { default: fixture1 } },
  'src/components/seer/index.fixture.tsx': { module: { default: fixture2 } },
};

export const decorators = {
  'src/cosmos.decorator.tsx': decorator0
};
