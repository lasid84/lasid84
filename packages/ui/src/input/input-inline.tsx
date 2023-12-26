import { InputWrapper } from "inputwrapper/inputwrapper";
import { Label } from "label/label";
import { Input } from "input/input";
import Widget from "widget/widget";

const InputInline: React.FC = () => (

    <Widget title="Inline" description={<span>Inline text inputs</span>}>
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
                <InputWrapper inline={true} outerClassName="sm:col-span-12">
                    <Label>Label</Label>
                    <Input name="name" type="text" width="w-64" />
                </InputWrapper>

            </div>
        </div>
    </Widget>

)