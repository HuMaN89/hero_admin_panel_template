import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import store from '../../store';
import { heroAdd} from "../heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Обязательное поле!";
  } else if (values.name.length > 35) {
    errors.name = "Не больше 35 символов!";
  }
  if (!values.description) {
    errors.description = "Обязательное поле!";
  } else if (values.description.length < 10) {
    errors.description = "Не меньше 10 символов!";
  } else if (values.description.length > 200) {
    errors.description = "Не больше 200 символов!";
  }
  if (!values.element) {
    errors.element = "Обязательное поле!";
  }
  return errors;
};
const HeroesAddForm = () => {
  const dispatch = useDispatch();
  const filters = selectAll(store.getState());
  const { request } = useHttp();
  const {  filtersLoadingStatus } = useSelector(
    (state) => state.filters
  );

  // useEffect(() => {
  //   dispatch(fetchFilters());
    
  //   // eslint-disable-next-line
  // }, []);

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      description: "",
      element: "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      values.id = uuidv4();
      request(
        "http://localhost:3001/heroes",
        "POST",
        JSON.stringify(values, null, 2)
      );
      dispatch(heroAdd(values));
      resetForm();
    },
  });

  if (filtersLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderFiltersList = (arr) => {
    return arr.map((item) => {
      return (
        <option className={item.name} key={item.name} value={item.name}>
          {item.label}
        </option>
      );
    });
  };

  return (
    <form
      className="border p-4 shadow-lg rounded"
      onSubmit={formik.handleSubmit}
    >
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name ? (
          <div style={{ color: "red" }}>{formik.errors.name}</div>
        ) : null}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label fs-4">
          Описание
        </label>
        <textarea
          name="description"
          className="form-control"
          id="description"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description ? (
          <div style={{ color: "red" }}>{formik.errors.description}</div>
        ) : null}
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          className="form-select"
          id="element"
          name="element"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.element}
        >
          {renderFiltersList(filters)}
          {/* <option>Я владею элементом...</option>
          <option value="fire">Огонь</option>
          <option value="water">Вода</option>
          <option value="wind">Ветер</option>
          <option value="earth">Земля</option> */}
        </select>
        {formik.touched.element && formik.errors.element ? (
          <div style={{ color: "red" }}>{formik.errors.element}</div>
        ) : null}
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
