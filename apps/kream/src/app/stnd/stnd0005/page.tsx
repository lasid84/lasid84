import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
const pageProps = {
    title: "종합코드관리",
    transKey: "nav.stnd.stnd0005",
    desc: "종합코드관리",
    url: "stnd0005"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "STND", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]

const Stnd0005: React.FC = () => {

    return (
        <>
            <PageTitle title={pageProps.title} brcmp={brcmp} />
            <SearchForm/>
            <ListGrid listItem={null}/>
        </>
    )

}

export default Stnd0005