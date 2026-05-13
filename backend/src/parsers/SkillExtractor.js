const skillsDictionary = [
  'JavaScript', 'Node.js', 'Express', 'React', 'MongoDB', 'Python', 'Django', 'Flask',
  'AWS', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'Redis', 'TypeScript', 'Java',
  'Spring Boot', 'PHP', 'Laravel', 'Vue.js', 'Angular', 'C++', 'C#', '.NET',
  'Go', 'Rust', 'Ruby', 'Rails', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'Terraform', 'Ansible', 'Jenkins', 'Azure', 'GCP', 'HTML', 'CSS', 'Tailwind',
  'GraphQL', 'Apollo', 'Redux', 'Next.js', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'Pandas', 'NumPy', 'Kafka', 'RabbitMQ', 'Elasticsearch', 'Solr', 'Prometheus', 'Grafana'
];

class SkillExtractor {
  static extract(text) {
    if (!text) return [];
    
    const foundSkills = new Set();
    const cleanText = text.toLowerCase();

    skillsDictionary.forEach(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Look for skill as a whole word, allowing for common separators
      const regex = new RegExp(`(?:^|\\s|[,./;()])${escapedSkill.toLowerCase()}(?:$|\\s|[,./;()])`, 'g');
      if (regex.test(cleanText)) {
        foundSkills.add(skill);
      }
    });

    // Special cases for skills that might be written differently
    if (/\bmern\b/i.test(cleanText)) {
      foundSkills.add('MongoDB');
      foundSkills.add('Express');
      foundSkills.add('React');
      foundSkills.add('Node.js');
    }
    
    if (/\bmean\b/i.test(cleanText)) {
      foundSkills.add('MongoDB');
      foundSkills.add('Express');
      foundSkills.add('Angular');
      foundSkills.add('Node.js');
    }

    return Array.from(foundSkills);
  }
}

module.exports = SkillExtractor;
