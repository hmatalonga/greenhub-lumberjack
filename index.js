#!/usr/bin/env node

'use strict';

const program = require('commander');
const greenhub = require('./lib/greenhub');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

/*eslint no-console: ["error", { allow: ["log"] }] */

program.version(pkg.version).description(greenhub.description);

program
  .command('count <model> [params...]')
  .alias('c')
  .description('return total number of records from specified model')
  .option('-d, --date <value>', 'single date query in `yyyy-mm-dd` date format')
  .option('-j, --json', 'output result in JSON')
  .option(
    '-L, --last <interval>',
    'amount of time interval of last <m>onth, <w>eek,<d>ay or <h>our'
  )
  .option(
    '-R, --range [from]..[to]',
    'time range of query in `yyyy-mm-dd` date format, optional arguments'
  )
  .action((model, params, options) => greenhub.count(model, params, options))
  .on('--help', () => {
    console.log();
    console.log('  Examples:');
    console.log();
    console.log(
      '    $ greenhub count devices                            # all devices'
    );
    console.log(
      '    $ greenhub count devices --date 2017-05-30          # devices registered on 2017-05-30'
    );
    console.log(
      '    $ greenhub count samples --last 12h                 # samples of the last 12 hours'
    );
    console.log(
      '    $ greenhub count devices -L 5d --json               # devices registered on the last 5 days in json'
    );
    console.log(
      '    $ greenhub count samples -R 2017-05-01..2017-05-31  # samples between 2017-05-01 and 2017-05-31'
    );
    console.log(
      '    $ greenhub count samples --range 2017-03-15..       # samples from 2017-03-15 to current date'
    );
    console.log(
      '    $ greenhub count samples --range ..2017-02-01       # samples before 2017-02-01'
    );
    console.log();
  });

program
  .command('docs')
  .description('open online GreenHub documentation')
  .action(() => greenhub.docs());

program
  .command('export <model> [params...]')
  .alias('e')
  .description('export a query of specified model to a csv file')
  .option('-d, --date <value>', 'single date query in `yyyy-mm-dd` date format')
  .option(
    '-L, --last <interval>',
    'amount of time interval of last <m>onth, <w>eek,<d>ay or <h>our'
  )
  .option(
    '-o, --output <file>',
    'output csv filename, default is output.csv',
    'output.csv'
  )
  .option(
    '-R, --range [from]..[to]',
    'time range of query in `yyyy-mm-dd` date format, optional arguments'
  )
  .option(
    '-t, --timeout <seconds>',
    'request timeout in seconds, max value is 60 and default is 10',
    10
  )
  .action((model, params, options) => greenhub.export(model, params, options))
  .on('--help', () => {
    console.log();
    console.log('  Parameters [params...] have format [name:value].');
    console.log();
    console.log('  See API online documentation for more information.');
    console.log();
    console.log('  Examples:');
    console.log();
    console.log(
      '    $ greenhub export devices                                # all devices'
    );
    console.log(
      '    $ greenhub export samples --date 2017-05-30              # samples received on 2017-05-30'
    );
    console.log(
      '    $ greenhub export devices --last 12h                     # devices of the last 12 hours'
    );
    console.log(
      "    $ greenhub export samples -L 3d -o ~/Work/samples3d.csv  # samples of the last 3d days to location '~/Work/samples3d.csv'"
    );
    console.log(
      '    $ greenhub export samples -R 2017-08-01..2017-08-31      # samples between 2017-08-01 and 2017-08-31'
    );
    console.log(
      '    $ greenhub export samples --range 2017-03-15..           # samples from 2017-03-15 to current date'
    );
    console.log(
      '    $ greenhub export samples --range ..2017-02-01           # samples before 2017-02-01'
    );
    console.log();
  });

program
  .command('list')
  .description('list available models')
  .option('-j, --json', 'output result in JSON')
  .action(options => greenhub.list(options));

program
  .command('login')
  .description('login with an user API token key')
  .option('-r --reload', 'reload login credentials')
  .action(options => greenhub.login(options));

program
  .command('logout')
  .description('logout any user API credentials')
  .action(() => greenhub.logout());

program
  .command('lumberjack <model> [params...]')
  .alias('j')
  .description('flexible query builder')
  .option('-a, --all', 'display all results from query at once')
  .option('-d, --date <value>', 'single date query in `yyyy-mm-dd` date format')
  .option('-e, --everything', 'load every model relationship with each result')
  .option(
    '-L, --last <interval>',
    'value of time interval of last <m>onth, <w>eek,<d>ay or <h>our'
  )
  .option(
    '-n, --num-items <num>',
    'number of items displayed per page, default is 10',
    10
  )
  .option('-o, --output <file>', 'output results to a JSON file')
  .option('-p, --page <page>', 'page to display, default is 1', 1)
  .option(
    '-R, --range [from]..[to]',
    'time range of query in `yyyy-mm-dd` date format, optional arguments'
  )
  .option(
    '-t, --timeout <seconds>',
    'request timeout in seconds, max value is 60 and default is 10',
    10
  )
  .option(
    '-w, --with <list>',
    'load specified model relationships, use `all` for everything'
  )
  .action((model, params, options) =>
    greenhub.lumberjack(model, params, options)
  )
  .on('--help', () => {
    console.log();
    console.log('  Parameters [params...] have format [name:value].');
    console.log();
    console.log(
      '  For option --with the relationships list has to be in quotation marks separated by spaces.'
    );
    console.log();
    console.log('  See API online documentation for more information.');
    console.log();
    console.log('  Examples:');
    console.log();
    console.log(
      '    $ greenhub lumberjack devices brand:google                     # devices with brand google'
    );
    console.log(
      '    $ greenhub lumberjack samples -L 3d -e                         # samples uploaded on the last 3 days and load all model relationships'
    );
    console.log(
      '    $ greenhub lumberjack devices --last 1w                        # devices registered on the last week'
    );
    console.log(
      '    $ greenhub lumberjack samples os:6.0 -n 5                      # samples with os version 6.0 and show 5 items per page'
    );
    console.log(
      '    $ greenhub lumberjack samples model:nexus -R ..2017-05-31      # samples with model nexus that were uploaded before 2017-05-31'
    );
    console.log(
      '    $ greenhub lumberjack devices brand:google -a -o output.json   # all devices with brand google to a file output.json'
    );
    console.log(
      "    $ greenhub lumberjack samples -w 'device settings'             # samples with device and settings model relationships"
    );
    console.log(
      "    $ greenhub lumberjack samples -w 'processes.permissions'       # samples with processes->permissions nested model relationship"
    );
    console.log();
  });

program
  .command('remote')
  .description('display the current GreenHub server URL')
  .option('-f --fetch', 'fetch server url')
  .action(options => greenhub.remote(options));

program
  .command('status')
  .description('check the status of the server')
  .option(
    '-t, --timeout <seconds>',
    'request timeout in seconds, default is 5',
    5
  )
  .action(options => greenhub.status(options));

program
  .command('token')
  .description('display the user API token key')
  .option('-n --new-token', 'generate new token')
  .action(options => greenhub.token(options));

program
  .command('whoami')
  .description('display information about the user')
  .option('-j, --json', 'output result in JSON')
  .action(options => greenhub.whoami(options));

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
