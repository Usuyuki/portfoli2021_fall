/** @format */
import Layout from "../../../components/layout";
import WorksCards from "../../../components/cards/worksCards";
import changeUidToName from "../../../lib/changeUidToName";
// レンダリング前に実行される
export const getStaticProps = async ({ params }) => {
  const data = await fetch(
    "https://pfapi.usuyuki.net/jsonapi/node/works?sort=-field_works_deploy_start&include=field_works_thumbnail,field_works_genre&filter[field_works_genre.id]=" +
      params.genreId
  ).then((r) => r.json());
  const genreName = changeUidToName(params.genreId, "works");
  return { props: { data, genreName }, revalidate: 120 };
};
export async function getStaticPaths() {
  const data = await fetch("https://pfapi.usuyuki.net/jsonapi/node/works").then(
    (r) => r.json()
  );
  let idList = data.data.map((value) => {
    return value.relationships.field_works_genre.data.map((tech) => {
      return tech.id.toString();
    });
  });

  let lawIds = [];
  idList.forEach((value) => value.forEach((valueV) => lawIds.push(valueV)));
  const paths = lawIds.map((value) => ({
    params: { genreId: value },
  }));

  return { paths, fallback: false };
}

export default function Genres({ data, genreName }) {
  let title_prefix = genreName;
  let pageTitle = genreName;
  let image_urls = []; //urlの配列
  let genre_names = {}; //[ジャンルid]=ジャンル名

  data.included.forEach((element) => {
    if (element.type == "file--file") {
      image_urls.push(
        "https://pfapi.usuyuki.net/" + element.attributes.uri.url
      );
    } else if (element.type == "taxonomy_term--works_genre") {
      genre_names[element.id] = element.attributes.name;
    }
  });

  return (
    <div>
      <Layout title_prefix={title_prefix} pageTitle={pageTitle}>
        <div className="">
          <WorksCards
            content={data}
            image_urls={image_urls}
            genre_names={genre_names}
          />
        </div>
      </Layout>
    </div>
  );
}
