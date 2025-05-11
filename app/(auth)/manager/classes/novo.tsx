import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { TextInput } from "@/components/ThemedTextInput";
import { useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Pressable } from "react-native";
import { Router, useRouter } from "expo-router";
import { GestorClassProps } from "@/types/ManagerTypes";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useClasses } from "@/context/ClassContext";

const today = new Date();

export default function NewClass() {
  const {
    createClass,
  } = useClasses();

  const defaultData: Omit<GestorClassCreateProps, "id"> = {
    name: "",
    description: "",
    prof: "",
    startingDate: new Date(),
    minuteLength: 0,
    vagas: 0,
    sala: "",
    status: "upcoming",
    inscritos: 0,
  }
  const [data, setData] = useState(defaultData);

  const router = useRouter();

  const numericInputHandler = (s: string) => {
    return parseInt(s.replace(/[^0-9]/g, ''));
  }

  return (
    <PageContainer as={ScrollView}>
      <View style={stylesItem.container}>
        <TextInput
          placeholder="Digite o título..."
          label="Título da Aula"
          maxLength={50}
          value={data.name}
          onChangeText={s => setData(data => ({ ...data, name: s }))}
        />
        <TextInput
          placeholder="Descrição"
          label="Digite a descrição..."
          maxLength={500}
          value={data.description}
          onChangeText={s => setData(data => ({ ...data, description: s }))}
        />
        <DateTimeInput startingDate={data.startingDate}
          setStartingDate={date => setData(data => ({ ...data, startingDate: date }))} />
        <TextInput
          placeholder="Digite a duração..."
          label="Duração (minutos)"
          maxLength={3}
          keyboardType="numeric"
          value={isNaN(data.minuteLength) ? "" : data.minuteLength.toString()}
          onChangeText={s => setData(data => ({ ...data, minuteLength: numericInputHandler(s) }))}
        />
        <TextInput
          placeholder="Digite o professor..."
          label="Professor"
          maxLength={80}
          value={data.prof}
          onChangeText={s => setData(data => ({ ...data, prof: s }))}
        />
        <TextInput
          placeholder="Digite o número/nome da sala..."
          label="Sala"
          maxLength={30}
          value={data.sala}
          onChangeText={s => setData(data => ({ ...data, sala: s }))}
        />
        <TextInput
          placeholder="Insira o número de vagas..."
          label="Número de Vagas"
          maxLength={3}
          keyboardType="numeric"
          value={isNaN(data.vagas) ? "" : data.vagas.toString()}
          onChangeText={s => setData(data => ({ ...data, vagas: numericInputHandler(s) }))}
        />
        <Button style={stylesItem.button} size="large" onPress={() => dataConfirmationHandler(data, router, createClass)}>
          <Text lightColor="#fff">Editar Aula</Text>
        </Button>
      </View>
    </PageContainer>
  );
}

function DateTimeInput({ startingDate, setStartingDate }: DateTimeInputProps) {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  type AndroidMode = "date" | "time";

  const showMode = (mode: string) => {
    setShow(true);
    setMode(mode);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    const dateString = currentDate?.toLocaleDateString("en-GB");
    const timeString = currentDate?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setShow(false);
    setStartingDate(currentDate!);
    setDate(dateString!);
    setTime(timeString!);
  };

  return (
    <>
      <View style={stylesItem.datetimeContainer}>
        <Pressable
          style={stylesItem.datetimeField}
          onPress={() => showMode("date")}
        >
          <TextInput
            label="Data e Hora"
            placeholder="dd/mm/yyyy"
            value={date}
            readOnly={true}
          />
        </Pressable>
        <Pressable
          style={stylesItem.datetimeField}
          onPress={() => showMode("time")}
        >
          <TextInput
            label=" "
            value={time}
            placeholder="hh:mm"
            readOnly={true}
          />
        </Pressable>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={startingDate}
          mode={mode as AndroidMode}
          is24Hour={true}
          minimumDate={today}
          maximumDate={new Date(today.getFullYear(), (today.getMonth() + 1) % 12, today.getDate())}
          onChange={onChange} />)}
    </>
  )
}

interface DateTimeInputProps {
  startingDate: Date;
  setStartingDate: (date: Date) => void;
}

function dataConfirmationHandler(data: Omit<GestorClassCreateProps, "id">, router: Router, createClass: (classData: Omit<GestorClassProps, "id" | "inscritos">) => Promise<string | null>) {
  if (data.name.length > 50 || data.name.length < 3) {
    Alert.alert("Título inválido", "O título deve conter ao menos 3 caracteres e menos de 50.");
    return;
  }

  if (data.description.length > 500) {
    Alert.alert("Descrição inválida", "A descrição deve ter menos de 500 caracteres.");
    return;
  }

  if (data.startingDate < new Date()) {
    Alert.alert("Data inválida", "A aula não pode ser marcada para o passado.");
    return;
  }

  if (data.startingDate > new Date(today.getFullYear(), (today.getMonth() + 1) % 12, today.getDate())) {
    Alert.alert("Data inválida", "Não se é permitido marcar aulas com mais de um mês de antecedẽncia.")
    return;
  }

  if (data.minuteLength < 15 || data.minuteLength >= 1000) {
    Alert.alert("Duração inválida", "A duração da aula deve estar entre 15 e 999 minutos.")
    return;
  }

  if (data.prof.length < 2 || data.prof.length > 80) {
    Alert.alert("Nome de professor inválido", "O nome do professor tem de ter no mínimo 2 caracteres e no máximo 80.")
    return;
  }

  if (data.sala.length < 1 || data.sala.length > 30) {
    Alert.alert("Nome de sala inválido", "O nome da sala tem de ter no mínimo 1 caracteres e no máximo 30.")
    return;
  }

  if (data.vagas <= 0 || data.vagas >= 1000) {
    Alert.alert("Número de vagas inválido", "O número de vagas deve estar entre 1 e 999.")
    return;
  }

  createClass(data);
  router.back();
}

interface GestorClassCreateProps extends GestorClassProps {
  description: string,
};

const stylesItem = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 20,
    width: "95%",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    marginBottom: 20,
  },
  datetimeContainer: {
    flexDirection: "row",
    gap: 5,
  },
  datetimeField: {
    width: "48%",
  },
});
