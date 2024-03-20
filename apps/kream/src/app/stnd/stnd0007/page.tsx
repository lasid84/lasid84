
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
const pageProps = {
    title: "회사정보관리",
    transKey: "nav.stnd.stnd0007",
    desc: "회사정보관리",
    url: "stnd0007"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "STND", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]

const Stnd0007: React.FC = () => {

    return (
        <>

            {/* <SearchForm/> */}
            <ListGrid listItem={null}/>
        </>
    )

}

export default Stnd0007