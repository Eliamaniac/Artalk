import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FeatureTitle } from '../FeatureTitle'
import { Reveal } from '../Reveal'
import { FeatureDesc } from '../FeatureDesc'
import { FeatureBase } from './FeatureBase'
import './SlightFeature.scss'

export const SlightFeature: React.FC = () => {
  const [percent, setPercent] = useState(0)
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  const onVisibleChange = (visible: boolean) => {
    setVisible(visible)
    if (visible) {
      const fn = setInterval(() => {
        setPercent((prev) => {
          const next = Math.round(prev + 0.5)
          if (next <= 100) {
            return next
          } else {
            clearInterval(fn)
            return 100
          }
        })
      }, 40)
    } else {
      setPercent(0)
    }
  }

  return (
    <FeatureBase className="slight" onVisibleChange={onVisibleChange}>
      <FeatureTitle text={t('feature_slight_title')} color="#77B255" />

      <div className="content">
        <main>
          <div className="progress-wrap">
            <div className="progress">
              <div className="bar" style={{ width: `${percent >= 100 || visible ? 100 : 0}%` }} />
            </div>
            <div className="text">
              <div className="size">40KB</div>
              <div className="percent">{percent}%</div>
            </div>
          </div>

          <Reveal delay={200}>
            <FeatureDesc>
              {t('feature_slight_desc_line_1')}
              <br />
              {t('feature_slight_desc_line_2')}
            </FeatureDesc>
          </Reveal>
        </main>

        <aside>
          <svg
            className="leaf-wrap"
            width="338"
            height="330"
            viewBox="0 0 338 330"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="leaf">
              <path
                d="M100.05 227.714C129.808 257.472 198.146 298.863 275.608 227.298C231.821 218.875 224.117 163.163 194.353 133.411C164.595 103.647 123.073 96.9183 93.3094 126.676C63.5515 156.434 70.2866 197.95 100.05 227.714Z"
                fill="#A6D388"
              />
              <path
                d="M208.733 235.204C245.16 244.917 272.089 230.817 274.573 228.332C274.573 228.332 252.068 238.741 212.995 219.558C218.654 212.353 235.905 202.266 235.905 202.266C232.617 200.209 211.663 200.928 197.355 210.76C190.471 206.403 183.183 201.148 175.521 194.859L180.514 189.681C199.834 169.565 221.793 174.321 221.793 174.321C218 170.677 188.51 153.866 164.827 178.482L161.183 182.275C158.651 179.903 156.095 177.448 153.491 174.844L142.494 163.847L148.819 157.516C168.56 137.78 197.718 137.002 197.718 137.002C193.996 133.274 156.921 121.255 132.78 145.395L128.405 149.764L79.1141 100.461C75.3928 96.734 69.0561 97.0431 65.3408 100.758C61.6196 104.48 61.3164 110.81 65.0376 114.532L114.335 163.829L113.984 164.18C89.8438 188.326 99.8661 227.393 103.593 231.12C103.593 231.12 106.375 199.959 126.117 180.224L128.417 177.917L149.229 198.735C149.568 199.074 149.9 199.365 150.239 199.704C135.824 228.219 157.545 261.169 161.879 263.809C161.879 263.809 153.17 235.733 164.732 212.478C173.803 219.582 182.684 224.932 191.226 228.855C191.72 246.647 207.318 262.739 211.104 264.112C211.104 264.112 205.689 246.261 207.93 237.439L208.733 235.204Z"
                fill="#77B255"
              />
            </g>
            <path
              className="wind"
              d="M193.271 117.444C190.917 117.444 188.688 116.03 187.755 113.711C186.536 110.668 188.004 107.22 191.042 105.989C192.029 105.585 214.915 95.8958 217.293 69.3539C217.59 66.0904 220.408 63.7007 223.742 63.9623C227.018 64.2535 229.425 67.1425 229.134 70.412C226.09 104.361 196.731 116.511 195.482 117.01C194.757 117.308 194.008 117.444 193.271 117.444ZM222.993 141.222C220.532 141.222 218.232 139.683 217.382 137.233C216.306 134.142 217.929 130.766 221.008 129.678C222.125 129.274 247.907 119.507 252.989 81.005C253.417 77.7534 256.324 75.4469 259.659 75.8928C262.916 76.3208 265.205 79.3049 264.771 82.5624C258.702 128.632 226.322 140.42 224.949 140.895C224.301 141.115 223.641 141.222 222.993 141.222ZM240.833 176.889C238.734 176.889 236.707 175.771 235.619 173.804C234.038 170.933 235.09 167.318 237.961 165.737C238.122 165.648 254.315 156.606 259.367 144.825C260.663 141.805 264.171 140.414 267.167 141.704C270.186 142.994 271.583 146.489 270.287 149.509C263.612 165.083 244.494 175.712 243.686 176.158C242.776 176.651 241.802 176.889 240.833 176.889Z"
              fill="#5DADEC"
            />
          </svg>
        </aside>
      </div>
    </FeatureBase>
  )
}
