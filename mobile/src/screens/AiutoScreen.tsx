import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const faqData = [
  {
    id: 1,
    question: "Come posso prenotare una barca?",
    answer: "Usa la funzione di ricerca per trovare la barca ideale, seleziona le date e completa la prenotazione con i dati richiesti e il pagamento."
  },
  {
    id: 2,
    question: "Serve la patente nautica?",
    answer: "Dipende dal tipo di imbarcazione. Le barche senza patente non richiedono licenza, mentre yacht e barche più grandi sì."
  },
  {
    id: 3,
    question: "Posso cancellare la prenotazione?",
    answer: "Le cancellazioni sono possibili secondo i termini del proprietario. Controlla sempre la politica di cancellazione prima di prenotare."
  },
  {
    id: 4,
    question: "È inclusa l'assicurazione?",
    answer: "Tutte le imbarcazioni su SeaGO sono coperte da assicurazione di base. Puoi aggiungere coperture extra durante la prenotazione."
  },
];

const contactOptions = [
  {
    id: 1,
    title: "Email",
    subtitle: "support@seago.it",
    icon: "mail",
    color: "#0ea5e9",
    action: () => Linking.openURL('mailto:support@seago.it')
  },
  {
    id: 2,
    title: "Telefono",
    subtitle: "+39 06 1234 5678",
    icon: "call",
    color: "#10b981",
    action: () => Linking.openURL('tel:+390612345678')
  },
  {
    id: 3,
    title: "WhatsApp",
    subtitle: "Chat dal vivo",
    icon: "logo-whatsapp",
    color: "#25d366",
    action: () => Linking.openURL('https://wa.me/390612345678')
  },
];

export default function AiutoScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Centro Assistenza</Text>
          <Text style={styles.headerSubtitle}>Siamo qui per aiutarti</Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contattaci</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${option.color}15` }]}>
                  <Icon name={option.icon} size={24} color={option.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Domande Frequenti</Text>
          <View style={styles.faqContainer}>
            {faqData.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFaq(faq.id)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Icon
                    name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Azioni Rapide</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickAction}>
              <Icon name="document-text" size={24} color="#0ea5e9" />
              <Text style={styles.quickActionText}>Termini di Servizio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Icon name="shield-checkmark" size={24} color="#10b981" />
              <Text style={styles.quickActionText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Icon name="star" size={24} color="#f59e0b" />
              <Text style={styles.quickActionText}>Valuta l'App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  contactContainer: {
    marginHorizontal: 20,
  },
  contactCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  faqContainer: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    color: '#374151',
  },
});