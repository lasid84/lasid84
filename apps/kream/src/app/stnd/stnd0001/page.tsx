import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
const pageProps = {
    title: "사용자 기준정보",
    transKey: "nav.stnd.stnd0001",
    desc: "사용자 기준정보",
    url: "stnd0005"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "STND", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]

const Stnd0001: React.FC = () => {

    return (
        <>
            <PageTitle title={pageProps.title} brcmp={brcmp} />
            <SearchForm/>
            <ListGrid listItem={null}/>
        </>
    )

}

export default Stnd0001