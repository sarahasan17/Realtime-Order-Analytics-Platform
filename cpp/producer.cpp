#include <iostream>
#include <fstream>
#include <string>
#include <librdkafka/rdkafkacpp.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main()
{
    std::string brokers = "kafka:9092";
    std::string topic_name = "orders";

    std::string errstr;

    RdKafka::Conf *conf = RdKafka::Conf::create(RdKafka::Conf::CONF_GLOBAL);
    if (conf->set("bootstrap.servers", brokers, errstr) != RdKafka::Conf::CONF_OK)
    {
        std::cerr << errstr << std::endl;
        return 1;
    }

    RdKafka::Producer *producer = RdKafka::Producer::create(conf, errstr);
    if (!producer)
    {
        std::cerr << "Failed to create producer: " << errstr << std::endl;
        return 1;
    }

    RdKafka::Topic *topic = RdKafka::Topic::create(producer, topic_name, NULL, errstr);
    if (!topic)
    {
        std::cerr << "Failed to create topic: " << errstr << std::endl;
        return 1;
    }

    std::ifstream file("orders.json");
    if (!file)
    {
        std::cerr << "Could not open orders.json" << std::endl;
        return 1;
    }

    json orders;
    file >> orders;

    for (auto &order : orders)
    {
        std::string message = order.dump();

        RdKafka::ErrorCode resp = producer->produce(
            topic,
            RdKafka::Topic::PARTITION_UA,
            RdKafka::Producer::RK_MSG_COPY,
            const_cast<char *>(message.c_str()),
            message.size(),
            NULL,
            NULL);

        if (resp != RdKafka::ERR_NO_ERROR)
        {
            std::cerr << "Produce failed: "
                      << RdKafka::err2str(resp) << std::endl;
        }
        else
        {
            std::cout << "Sent: " << message << std::endl;
        }

        producer->poll(0);
    }

    producer->flush(5000);

    delete topic;
    delete producer;
    delete conf;

    return 0;
}