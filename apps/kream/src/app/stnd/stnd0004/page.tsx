import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
const pageProps = {
    title: " 언어관리",
    transKey: "nav.stnd.stnd0004",
    desc: "언어관리",
    url: "stnd0004"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "STND", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]

const Stnd0004: React.FC = () => {

    return (
        <>
            <PageTitle title={pageProps.title} brcmp={brcmp} />
            <SearchForm/>
            <ListGrid listItem={null}/>
        </>
    )

}

export default Stnd0004