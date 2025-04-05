import { Card as BaseCard } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ComponentProps } from "react";
import MapView from "react-native-maps";

function ContactCard({
  iconName,
  title,
  description,
}: {
  iconName: ComponentProps<typeof Icon>["name"];
  title: string;
  description: string;
}) {
  const iconColor = useThemeColor({}, "primary");
  return (
    <BaseCard style={styles.card}>
      <Icon name={iconName} size={32} color={iconColor} />
      <View>
        <Text type="defaultSemiBold">{title}</Text>
        <Text>{description}</Text>
      </View>
    </BaseCard>
  );
}

export default function Contact() {
  return (
    <PageContainer>
      <View style={{ gap: 10, marginTop: 20 }}>
        <ContactCard
          iconName="home"
          title="Nossa localização"
          description="Escola Superior de Tecnologia e Gestão, 5300-252 Bragança"
        />
        <ContactCard
          iconName="phone"
          title="Telefone"
          description="+351 273 303 200"
        />
        <ContactCard
          iconName="mail"
          title="Email"
          description="gym.class@gmail.com"
        />
        <MapView
          region={{
            latitude: 41.805,
            longitude: -6.759,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          style={styles.map}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  map: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
});
