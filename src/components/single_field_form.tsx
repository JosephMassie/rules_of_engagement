import { HTMLProps, useEffect, useState } from 'react';
import { Input } from './ui/input';
import clsx from 'clsx';
import { Button } from './ui/button';
import { FaCheckCircle } from 'react-icons/fa';

type Props = HTMLProps<HTMLFormElement> & {
    fieldVal: string | number;
};

const SingleFieldForm: React.FC<Props> = ({
    fieldVal,
    className,
    ...props
}) => {
    const [value, setValue] = useState(fieldVal);
    const isNum = typeof fieldVal === 'number';
    useEffect(() => {
        setValue(fieldVal);
    }, [fieldVal]);

    return (
        <form className={clsx('flex', className)} {...props}>
            <Input
                name="field_val"
                value={value}
                type={isNum ? 'number' : 'text'}
                onChange={(event) => {
                    setValue(
                        isNum ? event.target.valueAsNumber : event.target.value
                    );
                }}
            />

            <Button variant="secondary" disabled={value === fieldVal}>
                <FaCheckCircle />
            </Button>
        </form>
    );
};

export default SingleFieldForm;
