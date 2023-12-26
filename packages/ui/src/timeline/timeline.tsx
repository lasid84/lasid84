const items = [
    {
      "index": 1,
      "title": "Perferendis dignissimos provident saepe in.",
      "sentence": "Corporis in est quae exercitationem.",
      "description": "Veniam reiciendis qui nemo aut laborum voluptate id beatae et.",
      "number": 6,
      "img": "/images/faces/w1.png",
      "timeago": "a few seconds ago"
    },
    {
      "index": 2,
      "title": "Eos et aut perspiciatis et.",
      "sentence": "Hic praesentium veritatis sapiente voluptatem.",
      "description": "Illo voluptate distinctio hic vitae molestiae culpa ipsam eveniet doloremque.",
      "number": 8,
      "img": "/images/faces/m8.png",
      "timeago": "a day ago"
    },
    {
      "index": 3,
      "title": "Vero voluptatibus est voluptas quas.",
      "sentence": "Ut iusto praesentium harum molestias.",
      "description": "Explicabo est qui illum et quo occaecati beatae hic eos.",
      "number": 5,
      "img": "/images/faces/m8.png",
      "timeago": "2 days ago"
    },
    {
      "index": 4,
      "title": "Non maxime fuga nemo officiis.",
      "sentence": "Dolore nam laudantium vel voluptatem.",
      "description": "Ab eius exercitationem molestiae architecto voluptatem possimus quos mollitia omnis.",
      "number": 2,
      "img": "/images/faces/w9.png",
      "timeago": "3 days ago"
    }
  ]
  

export const Timeline: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {items.map((item, i) => (
        <div className="flex relative justify-start items-start" key={i}>
          <div className="absolute inset-0 flex items-center justify-center w-6 h-full">
            <div className="w-1 h-full bg-gray-200 pointer-events-none dark:bg-gray-800"></div>
          </div>
          <div className="relative z-10 inline-flex items-center justify-center shrink-0 w-6 h-6 text-sm font-medium text-white bg-blue-500 rounded-full">
            {item.index}
          </div>
          <div className="flex flex-col items-start flex-grow pb-4">
            <div className="flex items-start justify-start px-4">
              <div className="flex flex-col w-full">
                <div className="text-sm font-bold">{item.title}</div>
                <div className="text-sm">{item.sentence}</div>
                <div className="text-sm">{item.timeago}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
