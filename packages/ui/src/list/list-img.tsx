import {CircularBadge} from "badge/badge";

export type ItemProps = {
  title: string;
  img: string;
};

export type ListProps = {
  items: ItemProps[];
};

const ListImg: React.FC<ListProps> = ({items}) => (
  <div className="w-full mb-4">
    {items.map((item, i) => (
      <div className="flex items-center justify-start p-2 space-x-4" key={i}>
        <div className="shrink-0 w-8">
          <img
            src={item.img}
            alt="media"
            className="h-8 w-full shadow-lg rounded-full ring"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="text-sm">{item.title}</div>
        </div>
        <div className="shrink-0">
          <CircularBadge size="sm" color="bg-indigo-500 text-white">
            1
          </CircularBadge>
        </div>
      </div>
    ))}
  </div>
);

export default ListImg;
