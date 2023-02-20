import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters, activeFilterChanged, selectAll} from "./filtersSlice";
import store from '../../store';

const HeroesFilters = () => {
  const {  filtersLoadingStatus } = useSelector(
    (state) => state.filters
  );
  const filters = selectAll(store.getState());
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilters());
    // eslint-disable-next-line
  }, []);

  if (filtersLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderFiltersList = (arr) => {
    return arr.map((item) => {
      let clazz = "";
      if (item.name === "all") {
        clazz = `btn ${item.className} active`;
      } else {
        clazz = `btn ${item.className}`;
      }
      return (
        <option
          key={item.name}
          className={clazz}
          onClick={() => dispatch(activeFilterChanged(item.name))}
        >
          {item.label}
        </option>
      );
    });
  };
  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{renderFiltersList(filters)}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
