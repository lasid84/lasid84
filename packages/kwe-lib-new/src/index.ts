import { callPostgresProcedure } from './db/executor/postgresExecutor';
import { log } from './log';

export * from './log';
export * from './utils';


const main = async () => {
    log(await callPostgresProcedure('postgres://kwe:kwe@10.33.63.51:5432/kwe', 'public.f_stnd0001_load', ['in_user', 'in_ipaddr'], ['','']));
}


main();