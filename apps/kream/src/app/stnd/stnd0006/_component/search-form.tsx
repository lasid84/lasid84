import PageSearch from "../../../../shared/tmpl/page-search"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"




type Props = {
    onSubmit: SubmitHandler<any>
}
const SearchForm: React.FC<Props> = ({ onSubmit }) => {
    return (
        <><PageSearch
            right={
                <>검색 버튼</>
            }>
            <div>검색 컬럼</div>
        </PageSearch></>
    )

}

export default SearchForm