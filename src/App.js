import React, { useEffect, useMemo, useState } from "react";
import ItemMes from "./components/ItemMes";
import { auth, db, firebase, providerGoogle } from "./services/Firebase";
import "./styles/App.css";
import { CgClose } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { VscAdd } from "react-icons/vsc";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi";
import { useStateValue } from "./providers/StateProvider";
import { actionTypes } from "./providers/reducer";
import { BsCheck2, BsTrash } from "react-icons/bs";
import { TiArrowSortedDown } from "react-icons/ti";
import Footer from "./components/footer";
import { SiFacebook, SiTwitter, SiWhatsapp } from "react-icons/si";
import ItemUnidade from "./components/ItemUnidade";

function App() {
  const [top, setTop] = useState(false);

  useEffect(() => {
    const eventScrool = () => {
      if (window.scrollY > 100) {
        setTop(true);
      } else {
        setTop(false);
      }
    };

    window.addEventListener("scroll", eventScrool);
    return () => {
      window.removeEventListener("scroll", eventScrool);
    };
  }, []);

  const mesesTODOS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const meses = [
    "Todos",
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const [modalAddEvento, setModalAddEvento] = useState(false);
  const [selectOrgazinacao, setSelectOrgazinacao] = useState(null);
  const [organizacoes, setOrganizacoes] = useState([
    {
      color: "#000167",
      organizacao: "Atividades mundiais",
    },
    {
      color: "#42FF4F",
      organizacao: "Atividades do templo e história da família",
    },
    {
      color: "#48EB8B",
      organizacao: "Atividades da Área Brasil",
    },
    {
      color: "#FF895F",
      organizacao: "Atividades da Presidência da Estaca.",
    },
    {
      color: "#3F45EB",
      organizacao: "Sociedade de socorro",
    },
    {
      color: "#E8237D",
      organizacao: "Moças",
    },
    {
      color: "#EBCA49",
      organizacao: "Primária",
    },
    {
      color: "#EB5757",
      organizacao: "Rapazes e Moças",
    },
    {
      color: "#53EBFF",
      organizacao: "Escola Dominical",
    },
  ]);
  const [modalSelect, setModalSelect] = useState(false);
  //
  const [INPUTnomeEvento, setINPUTnomeEvento] = useState("");
  const [INPUTdiaEvento, setINPUTdiaEvento] = useState("");
  const [INPUTmesEvento, setINPUTmesEvento] = useState("");
  // -link-
  const [INPUTlinksEvento, setINPUTlinksEvento] = useState([]);
  const [INPUTlinksNOMEEvento, setINPUTlinksNOMEEvento] = useState("");
  const [INPUTlinksLINKEvento, setINPUTlinksLINKEvento] = useState("");

  // link events :)
  const addLink = () => {
    setINPUTlinksEvento((add) => [
      ...add,
      {
        nome: INPUTlinksNOMEEvento,
        link: INPUTlinksLINKEvento,
      },
    ]);

    setINPUTlinksNOMEEvento("");
    setINPUTlinksLINKEvento("");
  };

  const removeLink = (link) => {
    var links = [...INPUTlinksEvento];
    const index = links.findIndex((x) => x.link === link);

    if (index >= 0) {
      links.splice(index, 1);
      setINPUTlinksEvento(links);
    }
  };

  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    db.collection("unidades").onSnapshot((snapshot) => {
      setUnidades(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const [selectUnidade, setSelectUnidade] = useState({
    nome: "Estaca Pacajus",
    email: "estacapacajussiao@gmail.com",
  });
  const [modalUnidades, setModalUnidades] = useState(false);

  const getUnidadeInEmail = () => {
    return unidades.filter((uni) => {
      return uni.email === user?.email;
    });
  };

  const isAdmin = () => {
    if (user?.email === selectUnidade.email) {
      var filter = unidades.filter((uni) => {
        return uni.email === user?.email;
      });
      return filter.length > 0;
    } else {
      return false;
    }
  };

  // -- ADD EVENTO --
  const addEvento = (e) => {
    e.preventDefault();

    const objEvento = {
      mes: INPUTmesEvento,
      dia: INPUTdiaEvento,
      nome: INPUTnomeEvento,
      links: INPUTlinksEvento,
      selectOrgazinacao: selectOrgazinacao,
      unidade: getUnidadeInEmail()[0],
    };

    db.collection("calendario")
      .doc("anual")
      .collection("eventos")
      .add(objEvento);

    setINPUTmesEvento("");
    setINPUTnomeEvento("");
    setINPUTdiaEvento("");
    setModalAddEvento(!modalAddEvento);
  };

  // Só esse email pode adicionar, atualizar e deletar o evento
  const emailESTACAPACAJUS = "estacapacajussiao@gmail.com";

  const loginGoogle = () => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth.signInWithPopup(providerGoogle).catch((e) => {
          var errorCode = e.code;
          var errorMessage = e.message;

          alert(errorMessage);
        });
      })
      .catch((e) => {
        var errorCode = e.code;
        var errorMessage = e.message;

        alert(errorMessage);
      });
  };

  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: actionTypes.SET_USER,
          user: authUser,
        });
      } else {
        auth.signOut();
      }
    });
  }, [user, auth]);

  const [activeMes, setActiveMes] = useState(meses[0]);

  const mesesFilter = useMemo(() => {
    if (activeMes === "Todos") {
      return mesesTODOS;
    } else {
      return meses.filter((mes) => {
        return mes === activeMes;
      });
    }
  }, [activeMes, meses, mesesTODOS]);

  const [modalShare, setModalShare] = useState(false);

  const COPY = (text) => {
    if (document.queryCommandSupported("copy")) {
      var textField = document.createElement("textarea");
      textField.innerText = text;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();

      alert("Link Copiado...");
    }
  };

  const textoCompartilhar = `Calendário anual da Estaca Pacajus Brasil 2022 ${encodeURIComponent(
    document.URL
  )}`;

  const [modalAddUnidade, setModalAddUnidade] = useState(false);

  const [INPUTnomeUnidade, setINPUTnomeUnidade] = useState("");
  const [INPUTemailUnidade, setINPUTemailUnidade] = useState("");

  // -- ADD UNIDADE --
  const addUnidade = (e) => {
    e.preventDefault();

    const objUnidade = {
      nome: INPUTnomeUnidade,
      email: INPUTemailUnidade,
    };

    db.collection("unidades").add(objUnidade);

    setINPUTnomeUnidade("");
    setINPUTemailUnidade("");
    setModalAddUnidade(!modalAddUnidade);
  };

  const removeUnidade = (uni) => {
    if (window.confirm(`Quer mesmo deletar a unidade ${uni.nome}?`)) {
      db.collection("unidades").doc(uni.id).delete();
    }
  };

  return (
    <>
      <div className="calendario--banner">
        <div>
          <svg
            onClick={() =>
              (window.location.href =
                "https://www.estacapacajus.com/calend%C3%A1rio-da-estaca")
            }
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 19L8.5 12L15.5 5"
              stroke="#130F26"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <p>CALENDÁRIO ANUAL DA ESTACA PACAJUS BRASIL 2022</p>
          <a onClick={() => setModalShare(!modalShare)}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
            </svg>
            Compartilhar calendário
          </a>
          <h6>
            TODAS as atividades da Estaca devem focar no plano para a Área
            Brasil - COLIGAR ISRAEL EM AMBOS OS LADOS DO VÉU - [Batismo de
            Conversos] + [Retenção de Conversos] + [Missionários Brasileiros
            Servindo] + [Templo como centro de adoração]
          </h6>

          <div
            onClick={() => setModalUnidades(!modalUnidades)}
            className="calendario--banner__unidade-select"
          >
            <TiArrowSortedDown
              style={{
                transform: modalUnidades ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
            <p>{selectUnidade?.nome !== null ? selectUnidade?.nome : ""}</p>
          </div>
        </div>
      </div>

      <div
        style={{
          opacity: modalShare ? 5 : 0,
          visibility: modalShare ? "visible" : "hidden",
        }}
        className="calendario--modal"
      >
        <div
          style={{ transform: modalShare ? "scale(1)" : "scale(0)" }}
          className="calendario--alterar__evento"
        >
          <div className="calendario--alterar__evento--header">
            <CgClose onClick={() => setModalShare(!modalShare)} />

            <p>Compartilhar calendário com:</p>
          </div>

          <div className="calendario--alterar__evento--content calendario--alterar__evento--content__share">
            <SiWhatsapp
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send?text=${textoCompartilhar}`
                )
              }
            />
            <SiFacebook
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    document.URL
                  )}`
                )
              }
            />
            <SiTwitter
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${textoCompartilhar}`
                )
              }
            />

            <article>
              <svg
                onClick={() => COPY(window.location.href)}
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1V4zm9 3l-3-3H5v10h8V7z"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3 1L2 2v10l1 1V2h6.414l-1-1H3z"
                ></path>
              </svg>
              <p onClick={() => COPY(window.location.href)}>
                Copiar link do calendário..
              </p>
            </article>
          </div>
        </div>
      </div>

      <div className="calendario">
        <div
          style={{
            opacity: modalUnidades ? 5 : 0,
            visibility: modalUnidades ? "visible" : "hidden",
            height: modalUnidades ? "" : 0,
          }}
          className="calendario--banner__unidade-select--itens"
        >
          {unidades.map((item) => (
            <div
              style={{
                background:
                  selectUnidade.nome === item.nome ? "rgb(238, 240, 243)" : "",
              }}
              onClick={() => {
                setSelectUnidade(item);
                setModalUnidades(false);
              }}
            >
              <p>{item.nome}</p>
            </div>
          ))}
        </div>

        <div className="calendario--filter">
          {meses.map((mes) => (
            <button
              onClick={() => setActiveMes(mes)}
              style={{
                color: mes === activeMes ? "" : "rgb(56, 57, 63)",
                background: mes === activeMes ? "rgba(14, 57, 86, 1)" : "#fff",
              }}
            >
              {mes}
            </button>
          ))}
        </div>

        <div className="calendario--meses">
          {mesesFilter.map((mes) => (
            <ItemMes
              mes={mes}
              selectUnidade={selectUnidade}
              user={user}
              emailESTACAPACAJUS={emailESTACAPACAJUS}
            />
          ))}
        </div>

        {user ? (
          <button
            style={{ top: 12, height: "fit-content" }}
            onClick={() => {
              auth.signOut();
              dispatch({
                type: actionTypes.SET_USER,
                user: null,
              });
            }}
          >
            <BiLogOut className="calendario--button-icon" />
            Sair
          </button>
        ) : (
          <button
            style={{ top: 12, height: "fit-content" }}
            onClick={() => loginGoogle()}
          >
            <HiOutlineUser className="calendario--button-icon" />
            Login
          </button>
        )}

        <button
          style={{
            bottom: top ? (isAdmin() ? 65 : 12) : -70,
            height: "fit-content",
            padding: "10px",
            borderRadius: "100%",
            transition: "all 0.3s ease",
          }}
          onClick={() => window.scrollTo({ top: 0 })}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.4"
              d="M11.7256 4.25L11.7256 19.25"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.70124 10.2998L11.7252 4.2498L17.7502 10.2998"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        {isAdmin() ? (
          <button onClick={() => setModalAddEvento(!modalAddEvento)}>
            Adicionar evento
          </button>
        ) : (
          ""
        )}

        {user?.email === emailESTACAPACAJUS ? (
          <button
            style={{ left: 12, right: "inital" }}
            onClick={() => setModalAddUnidade(!modalAddUnidade)}
          >
            <VscAdd
              style={{
                transform: modalAddEvento ? "rotate(45deg)" : "",
              }}
              className="calendario--button-icon"
            />
            Unidade
          </button>
        ) : (
          ""
        )}

        <div
          style={{
            opacity: modalAddUnidade ? 5 : 0,
            visibility: modalAddUnidade ? "visible" : "hidden",
          }}
          className="calendario--modal"
        >
          <div
            style={{ transform: modalAddUnidade ? "scale(1)" : "scale(0)" }}
            className="calendario--alterar__evento"
          >
            <div className="calendario--alterar__evento--header">
              <CgClose onClick={() => setModalAddUnidade(!modalAddUnidade)} />

              <p>Adicionar unidade</p>
            </div>

            <div className="calendario--alterar__evento--content">
              <input
                placeholder="Nome da unidade"
                value={INPUTnomeUnidade}
                onChange={(e) => setINPUTnomeUnidade(e.target.value)}
              />

              <input
                style={{ marginTop: "10px" }}
                placeholder="Email da unidade"
                value={INPUTemailUnidade}
                onChange={(e) => setINPUTemailUnidade(e.target.value)}
              />

              <div className="calendario--alterar__evento--content__link-add">
                <p>Unidades</p>
              </div>

              <div className="calendario--alterar__evento--content__links">
                {unidades.map((uni) => (
                  <ItemUnidade uni={uni} removeUnidade={removeUnidade} />
                ))}
              </div>
            </div>

            {INPUTnomeUnidade !== "" && INPUTemailUnidade !== "" ? (
              <button onClick={(e) => addUnidade(e)}>Adicionar unidade</button>
            ) : (
              <button disabled={true}>Adicionar unidade</button>
            )}
          </div>
        </div>

        <div
          style={{
            opacity: modalAddEvento ? 5 : 0,
            visibility: modalAddEvento ? "visible" : "hidden",
          }}
          className="calendario--modal"
        >
          <div
            style={{ transform: modalAddEvento ? "scale(1)" : "scale(0)" }}
            className="calendario--alterar__evento"
          >
            <div className="calendario--alterar__evento--header">
              <CgClose onClick={() => setModalAddEvento(!modalAddEvento)} />

              <p>Adicionar evento</p>
            </div>

            <div className="calendario--alterar__evento--content">
              <input
                placeholder="Nome do evento..."
                value={INPUTnomeEvento}
                onChange={(e) => setINPUTnomeEvento(e.target.value)}
              />

              <div
                onClick={() => setModalSelect(!modalSelect)}
                className="calendario--alterar__evento--content-select"
              >
                <TiArrowSortedDown
                  style={{
                    transform: modalSelect ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
                <p>
                  {!selectOrgazinacao
                    ? "Selecione a organização do evento..."
                    : selectOrgazinacao.organizacao}
                </p>
              </div>

              <div
                style={{
                  opacity: modalSelect ? 5 : 0,
                  visibility: modalSelect ? "visible" : "hidden",
                  height: modalSelect ? "" : 0,
                }}
                className="calendario--alterar__evento--content-select-itens"
              >
                {organizacoes.map((item) => (
                  <div
                    style={{
                      background:
                        selectOrgazinacao === item ? "rgb(238, 240, 243)" : "",
                    }}
                    onClick={() => {
                      setSelectOrgazinacao(item);
                      setModalSelect(false);
                    }}
                  >
                    <div
                      style={{
                        background: item.color !== "" ? item.color : "#000",
                      }}
                    ></div>
                    <p>{item.organizacao}</p>
                  </div>
                ))}
              </div>

              <section>
                <input
                  placeholder="Dia"
                  value={INPUTdiaEvento}
                  onChange={(e) => setINPUTdiaEvento(e.target.value)}
                />
                <p>de</p>
                <select
                  value={INPUTmesEvento}
                  onChange={(e) => setINPUTmesEvento(e.target.value)}
                >
                  <option value={""}>Mês</option>
                  {meses.map((mes) => (
                    <option value={mes}>{mes}</option>
                  ))}
                </select>
              </section>

              {/* LINKS */}
              <div className="calendario--alterar__evento--content__link-add">
                <p>Links</p>
                <input
                  placeholder="Nome do link"
                  value={INPUTlinksNOMEEvento}
                  onChange={(e) => setINPUTlinksNOMEEvento(e.target.value)}
                />
                <input
                  placeholder="URL do link"
                  value={INPUTlinksLINKEvento}
                  onChange={(e) => setINPUTlinksLINKEvento(e.target.value)}
                />
                {INPUTlinksLINKEvento !== "" ? (
                  <button onClick={() => addLink()}>
                    <VscAdd /> Adiconar link
                  </button>
                ) : (
                  <button disabled>
                    <VscAdd /> Adiconar link
                  </button>
                )}
              </div>

              <div className="calendario--alterar__evento--content__links">
                {INPUTlinksEvento.map((link) => (
                  <div>
                    <p>
                      <img
                        src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.link}`}
                      />
                      {link.nome}
                    </p>
                    <a rel="noreferrer" target="_blank" href={`${link.link}`}>
                      {link.link}
                    </a>
                    <button onClick={() => removeLink(link.link)}>
                      <BsTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {INPUTnomeEvento !== "" &&
            INPUTdiaEvento !== "" &&
            INPUTmesEvento !== "" &&
            selectOrgazinacao !== null ? (
              <button onClick={(e) => addEvento(e)}>Adicionar</button>
            ) : (
              <button disabled={true}>Adicionar</button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;
