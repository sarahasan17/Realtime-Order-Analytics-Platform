#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include <librdkafka/rdkafka.h>

static void dr_cb(rd_kafka_t *rk, const rd_kafka_message_t *msg, void *opaque)
{
    if (msg->err)
        std::cerr << "Delivery failed: " << rd_kafka_err2str(msg->err) << std::endl;
    else
        std::cout << "Delivered message to topic " << rd_kafka_topic_name(msg->rkt)
                  << " [" << msg->partition << "]" << std::endl;
}

int main()
{
    const std::string brokers = "kafka:9092";
    const std::string topic = "orders";

    char errstr[512];

    rd_kafka_conf_t *conf = rd_kafka_conf_new();
    rd_kafka_conf_set_dr_msg_cb(conf, dr_cb);

    rd_kafka_conf_set(conf, "bootstrap.servers", brokers.c_str(), errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "acks", "all", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "enable.idempotence", "true", errstr, sizeof(errstr));

    rd_kafka_t *producer = rd_kafka_new(RD_KAFKA_PRODUCER, conf, errstr, sizeof(errstr));
    rd_kafka_topic_t *rkt = rd_kafka_topic_new(producer, topic.c_str(), NULL);

    for (int i = 1; i <= 5; i++)
    {
        std::string msg = "Order Created #" + std::to_string(i);
        std::cout << "Producing message: " << msg << std::endl;

        int result = rd_kafka_produce(
            rkt,
            RD_KAFKA_PARTITION_UA,
            RD_KAFKA_MSG_F_COPY,
            (void *)msg.c_str(), msg.size(),
            NULL, 0,
            NULL);

        if (result != 0)
        {
            std::cerr << "Produce error: "
                      << rd_kafka_err2str(rd_kafka_last_error()) << std::endl;
        }

        rd_kafka_poll(producer, 100);
    }

    rd_kafka_flush(producer, 5000);
    rd_kafka_topic_destroy(rkt);
    rd_kafka_destroy(producer);

    std::cout << "Produced 5 messages!" << std::endl;
    return 0;
}
