import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { useGlobalSearchParams, useRouter } from "expo-router";

export default function ClassConfirmSubscribe() {
  const { classId } = useGlobalSearchParams();
  return (
    <PageContainer>
      <Text>{classId}</Text>
    </PageContainer>
  );
}
