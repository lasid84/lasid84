
import PageTitle from "components/page-title/page-title";

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function Page() {
    log("acct2002 시작")
    return (
        <>
        <PageTitle /*title={title!} brcmp={brcmp}*/ />
        </>
    )
}