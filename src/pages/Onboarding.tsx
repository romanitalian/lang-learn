import { useState } from 'react'
import { ArrowRight, Globe, Target, BookOpen } from 'lucide-react'

const Onboarding = () => {
  const [step, setStep] = useState(0)
  const [selectedLanguages, setSelectedLanguages] = useState({
    native: '',
    target: '',
  })

  const steps = [
    {
      title: 'Welcome to LangLearn',
      description: 'Your personal language learning companion',
      icon: Globe,
    },
    {
      title: 'Choose Your Languages',
      description: 'Select your native and target languages',
      icon: Target,
    },
    {
      title: 'Set Your Goal',
      description: 'How many cards would you like to study daily?',
      icon: BookOpen,
    },
  ]

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      console.log('Onboarding completed')
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {steps[step].title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {steps[step].description}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {step === 0 && (
            <div className="text-center">
              <Globe className="mx-auto h-12 w-12 text-primary-600" />
              <p className="mt-4 text-lg text-gray-600">
                LangLearn uses spaced repetition to help you learn vocabulary efficiently.
                Study a little every day and watch your progress grow!
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="label">Native Language</label>
                <select
                  value={selectedLanguages.native}
                  onChange={(e) => setSelectedLanguages(prev => ({ ...prev, native: e.target.value }))}
                  className="input"
                >
                  <option value="">Select your native language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Target Language</label>
                <select
                  value={selectedLanguages.target}
                  onChange={(e) => setSelectedLanguages(prev => ({ ...prev, target: e.target.value }))}
                  className="input"
                >
                  <option value="">Select language to learn</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="label">Daily Goal</label>
                <select className="input">
                  <option value="10">10 cards per day</option>
                  <option value="20">20 cards per day</option>
                  <option value="30">30 cards per day</option>
                  <option value="50">50 cards per day</option>
                </select>
              </div>
              <p className="text-sm text-gray-500">
                You can change this setting anytime in your preferences.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={step === 0}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="btn btn-primary flex items-center"
          >
            {step === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === step ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Onboarding

