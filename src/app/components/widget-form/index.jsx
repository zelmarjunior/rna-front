"use client";
import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import medications from "../../locales/medications";
import { questionsPart1, questionsPart2 } from "../../locales/questions";
import * as pt_BR from "../../locales/pt-BR";
import Loader from "../widget-loader/loader";
import "../../style/form.scss";
import SelectWithPlaceholder from "../widget-select";

export default function MyForm() {
  const [isLoading, setIsLoading] = useState(true);

  const [age, setAge] = useState("");
  const [questions, setQuestions] = useState({});
  const [selectedMedication, setSelectedMedication] = useState("");
  const [gender, setGender] = useState("");
  const [previousMedicationUse, setPreviousMedicationUse] = useState("");
  const [medicationUseError, setMedicationUseError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ageError, setAgeError] = useState(false);
  const [questionErrors, setQuestionErrors] = useState({});
  const [medicationError, setMedicationError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleQuestionChange = (event, questionNumber, questionTitle) => {
    const { value } = event.target;
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [`question${questionNumber}`]: {
        title: questionTitle,
        value: value,
      },
    }));

    setQuestionErrors((prevErrors) => ({
      ...prevErrors,
      [`question${questionNumber}`]: false,
    }));
  };

  const handleMedicationChange = (event) => {
    setSelectedMedication(event.target.value);
  };

  const handleMedicationUseChange = (event) => {
    const value = parseInt(event.target.value); // Converte o valor para número inteiro
    setPreviousMedicationUse(value);

    if (value === 2) {
      setSelectedMedication(0);
    } else {
      setSelectedMedication(null);
    }
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const unansweredQuestions = findUnansweredQuestions();

    if (unansweredQuestions.length === 0) {
      const itemsToSend = {
        Sexo: gender,
        Idade: age,
        Classificacao: questions.question1?.value,
        ITU_repeticao: questions.question2?.value,
        Hospitalizacao_previa: questions.question3?.value,
        Permanencia_UTI: questions.question4?.value,
        Uso_previo_antibiotico: previousMedicationUse,
        Qual_antibiotico: selectedMedication,
        Procedimento_trato_genital: (questions.question5?.value !== undefined && questions.question5?.value !== null) ? questions.question5.value - 1 : undefined,
        Cateter_vesical: questions.question6?.value,
        Doenca_Renal_Vesical_estrutural: questions.question7?.value,
        Casa_repouso: questions.question8?.value,
        IRC: questions.question9?.value,
        Cardiopatia: questions.question10?.value,
        Hepatopatia: questions.question11?.value,
        Diabetes: questions.question12?.value,
        Ostomias: questions.question13?.value,
        Demencia: questions.question14?.value,
        DST: questions.question15?.value,
        Doenca_pulmonar_cronica: questions.question16?.value,
        Gestante: questions.question17?.value,
        Neoplasias: questions.question18?.value,
      };

      for (const key in itemsToSend) {
        if (key !== "Procedimento_trato_genital" && itemsToSend[key] === 2) {
          itemsToSend[key] = 0;
        }
      }

      console.log(itemsToSend);
      try {
        setIsLoading(true);

        const response = await fetch(
          "https://rna-4845.onrender.com/prediction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemsToSend),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao enviar os dados para a API");
        }

        const responseData = await response.json();
        setPredictions(responseData);
        setShowForm(false);
      } catch (error) {
        console.error(`Erro ao enviar os dados para a API: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Se houver campos não respondidos, definir setErrorMessage como true
      setErrorMessage(true);

      validatePreviousMedicationUse();
      validateGender();
      validateAge();
      validateMedication();
      unansweredQuestions.forEach((question) => {
        if (question.startsWith("question")) {
          const questionNumber = question.substring(8);
          setQuestionErrors((prevErrors) => ({
            ...prevErrors,
            [`question${questionNumber}`]: true,
          }));
        }
      });
    }
  };

  const findUnansweredQuestions = () => {
    const unansweredQuestions = [];
    for (let i = 1; i <= 18; i++) {
      const questionTitle = `question${i}`;
      if (
        !questions[questionTitle]?.value &&
        questions[questionTitle]?.value !== 0
      ) {
        unansweredQuestions.push(questionTitle);
      }
    }
    return unansweredQuestions;
  };

  const handleClearForm = () => {
    setAge("");
    setQuestions({});
    setSelectedMedication("");
    setGender("");
    setErrorMessage("");
    setPreviousMedicationUse("");
    setQuestionErrors({});
    setMedicationUseError(false);
    setGenderError(false);
    setMedicationError(false);
    setAgeError(false);
  };

  const validateGender = useCallback(() => {
    if (gender === "" || gender === null || gender === undefined) {
      setGenderError(true);
    } else {
      setGenderError(false);
    }
  }, [gender]);

  useEffect(() => {
    if (gender !== "") {
      validateGender();
    }
  }, [gender, validateGender]);

  const validateAge = useCallback(() => {
    if (age === "" || age === null || age === undefined) {
      setAgeError(true);
    } else {
      setAgeError(false);
    }
  }, [age]);

  const validatePreviousMedicationUse = useCallback(() => {
    if (
      previousMedicationUse === "" ||
      previousMedicationUse === null ||
      previousMedicationUse === undefined
    ) {
      setMedicationUseError(true);
    } else {
      setMedicationUseError(false);
    }
  }, [previousMedicationUse]);

  useEffect(() => {
    if (previousMedicationUse !== "") {
      validatePreviousMedicationUse();
    }
  });

  useEffect(() => {
    if (age !== "") {
      validateAge();
    }
  }, [age, validateAge]);

  const validateMedication = useCallback(() => {
    if (
      selectedMedication === "" ||
      selectedMedication === null ||
      selectedMedication === undefined
    ) {
      setMedicationError(true);
    } else {
      setMedicationError(false);
    }
  }, [selectedMedication]);

  useEffect(() => {
    if (selectedMedication !== "") {
      validateMedication();
    }
  }, [selectedMedication, validateMedication]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false);
      clearTimeout(delay);
    }, 1000);
    return () => clearTimeout(delay);
  }, []);

  const handleRestartForm = () => {
    setShowForm(true);
    setPredictions(null);
    handleClearForm();
  };

  return (
    <div className="form-container">
      {isLoading && <Loader />}
      <div className="container-header">
        <div className="header-rna">
          <h1>{pt_BR.textRnaTitle}</h1>
          <span>{pt_BR.TextInfoRna}</span>
        </div>
      </div>

      {predictions && (
        <div className="container">
          <div className="title-prediction">
            <h1>{pt_BR.titlePrediction}</h1>
          </div>
          <div className="container-info">
            <div className="box-info-rna">
              <h2>{pt_BR.textPredictionCRE}</h2>
              <p>{(predictions.prediction_cre * 100).toFixed(2)}%</p>
            </div>
            <div className="box-info-rna">
              <h2>{pt_BR.textPredictionESBL}</h2>
              <p>{(predictions.prediction_esbl * 100).toFixed(2)}%</p>
            </div>
          </div>
          <div className="btn-container-restart">
            <Button className="btn-restart" onClick={() => handleRestartForm()}>
              <span>{pt_BR.textButtonReturnForm}</span>
            </Button>
          </div>
        </div>
      )}
      {showForm && (
        <form className="container" onSubmit={handleSubmit}>
          <div className="questions-container">
            <div className="box-title-questions">
              <span>{pt_BR.textTitleQuestions}</span>
            </div>
            <div className="container-box-one">
              <div className="select-age_gender_medications">
                <Box className="container-select">
                  <span className="title">{pt_BR.textGender}</span>
                  <SelectWithPlaceholder
                    id="gender"
                    value={gender}
                    onChange={handleGenderChange}
                    placeholder={pt_BR.textSelectGender}
                    options={[
                      { value: 2, label: pt_BR.textMale },
                      { value: 1, label: pt_BR.textFemale },
                    ]}
                    error={
                      genderError || gender === null || gender === undefined
                    }
                  />
                </Box>

                <Box className="container-select">
                  <span className="title">{pt_BR.textEnterYourAge}</span>
                  <SelectWithPlaceholder
                    id="age"
                    value={age}
                    onChange={handleAgeChange}
                    placeholder={pt_BR.textSelectYourAge}
                    options={[
                      ...Array.from({ length: 101 }, (_, i) => ({
                        value: i,
                        label: i,
                      })),
                    ]}
                    error={ageError || age === null || age === undefined}
                  />
                </Box>

                <Box className="container-select">
                  <span className="title">
                    {pt_BR.textPreviousUseMedication}
                  </span>
                  <SelectWithPlaceholder
                    id="medicationUse"
                    value={previousMedicationUse}
                    onChange={handleMedicationUseChange}
                    placeholder={pt_BR.textReponseSelect}
                    options={[
                      { value: 1, label: pt_BR.textYes },
                      { value: 2, label: pt_BR.textNo },
                    ]}
                    error={
                      medicationUseError ||
                      previousMedicationUse === null ||
                      previousMedicationUse === undefined
                    }
                  />
                </Box>

                <Box className="container-select">
                  <span className="title">{pt_BR.textSelectMedication}</span>
                  <SelectWithPlaceholder
                    id="selectedMedication"
                    value={selectedMedication}
                    questionTitle="selectedMedication"
                    onChange={(event) =>
                      setSelectedMedication(parseInt(event.target.value, 10))
                    }
                    placeholder={pt_BR.textSelectMedicationOption}
                    options={[
                      { value: 0, label: "Não se aplica", disabled: true },
                      ...medications.map((medication, index) => ({
                        value: index + 1,
                        label: medication,
                      })),
                    ]}
                    disabled={selectedMedication}
                    error={
                      medicationError ||
                      selectedMedication === null ||
                      selectedMedication === undefined
                    }
                  />
                </Box>
              </div>

              <div className="questions-table-one">
                {questionsPart1.map((question) => (
                  <Box key={question.number} className="container-select">
                    <span className="title">{question.title}</span>
                    <SelectWithPlaceholder
                      value={
                        questions[`question${question.number}`]?.value || ""
                      }
                      onChange={(event) =>
                        handleQuestionChange(
                          event,
                          question.number,
                          question.title
                        )
                      }
                      placeholder={pt_BR.textReponseSelect}
                      options={
                        question.title === "Classificação da ITU:"
                          ? [
                              { value: 1, label: pt_BR.ITUComplicated },
                              { value: 2, label: pt_BR.ITUNoComplicated },
                            ]
                          : question.title === "Procedimento do trato genital:"
                          ? [
                              { value: 1, label: "Não" },
                              { value: 2, label: "Litotripsia" },
                              { value: 3, label: "RTU" },
                              { value: 4, label: "Prostatectomia" },
                              { value: 5, label: "Nefrectomia" },
                              { value: 6, label: "Sling" },
                              { value: 7, label: "Duplo J" },
                              { value: 8, label: "AMIU" },
                              { value: 9, label: "Cistolitomia" },
                              { value: 10, label: "Cistolitomia + Bricker" },
                              { value: 11, label: "Uretrotomia" },
                              { value: 12, label: "Perineoplastia" },
                              { value: 13, label: "Cistectomia" },
                            ]
                          : [
                              { value: 1, label: pt_BR.textYes },
                              { value: 2, label: pt_BR.textNo },
                            ]
                      }
                      error={questionErrors[`question${question.number}`]}
                      questionNumber={question.number}
                      questionTitle={question.title}
                    />
                  </Box>
                ))}
              </div>
            </div>

            <div className="error-message">
              {errorMessage && <p>Responda todos os campos para continuar!</p>}
            </div>
            <div className="container-buttons">
              <Box>
                <Button
                  className="btn-container clean"
                  variant="contained"
                  onClick={handleClearForm}
                >
                  <span>{pt_BR.textClearForm}</span>
                </Button>
              </Box>
              <Button className="btn-container send" type="submit">
                <span>{pt_BR.textSubmit}</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
