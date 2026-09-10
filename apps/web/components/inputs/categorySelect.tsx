import Select, {
  SelectItem,
  SelectItemProps,
  SelectProps,
} from '@repo/ui/inputs/select';

const categories = [
  {
    label: 'Backend',
    value: 'BACKEND',
  },
  {
    label: 'Frontend',
    value: 'FRONTEND',
  },
  {
    label: 'Architecture',
    value: 'ARCHITECTURE',
  },
  {
    label: 'Infra',
    value: 'INFRA',
  },
  {
    label: 'Code',
    value: 'CODE',
  },
  {
    label: 'Editorial',
    value: 'EDITORIAL',
  },
] satisfies SelectItemProps[];

const CategorySelect = (props: SelectProps) => (
  <Select {...props}>
    {categories.map((category) => (
      <SelectItem
        key={`category-select-${category.value.toLowerCase()}-item`}
        {...category}
      />
    ))}
  </Select>
);

export default CategorySelect;
