const DEPLOY_PATH = '/var/www/preview.bassin-rond.net';

module.exports = {
  apps: [
    {
      name: 'site-bassin-rond',
      script: `${DEPLOY_PATH}/dist/server/entry.mjs`,
      cwd: DEPLOY_PATH,
      node_args: `--env-file=${DEPLOY_PATH}/.env`,
      interpreter: 'node',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
